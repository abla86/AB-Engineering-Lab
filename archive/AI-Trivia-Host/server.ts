import express from 'express';
import http from 'http';
import path from 'path';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
app.use(express.json());

// Initialize Google GenAI client (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Helper to convert raw 16-bit linear PCM audio (from gemini-3.1-flash-tts-preview)
 * into a standard WAV format with a 44-byte RIFF header for reliable browser playback.
 */
function pcmToWav(pcmBase64: string, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): string {
  const pcmBuffer = Buffer.from(pcmBase64, 'base64');
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM subchunk size
  header.writeUInt16LE(1, 20); // 1 = Linear PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // Byte rate
  header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // Block align
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  const wavBuffer = Buffer.concat([header, pcmBuffer]);
  return wavBuffer.toString('base64');
}

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Generate Trivia Round (with optional Google Search Grounding)
app.post('/api/trivia/generate-round', async (req, res) => {
  try {
    const {
      category = 'Pop Culture & Entertainment',
      customTopic = '',
      difficulty = 'Casual',
      questionCount = 5,
      hostSystemPrompt = 'You are a fun trivia host.',
      hostName = 'AI Host',
      useSearchGrounding = true,
    } = req.body;

    const topicLabel = customTopic ? `custom topic "${customTopic}"` : `category "${category}"`;

    const prompt = `You are ${hostName}. You are curating a 5-question trivia game for the ${topicLabel} at "${difficulty}" difficulty.
Your persona instruction:
${hostSystemPrompt}

Requirements:
1. Provide exactly ${questionCount} distinct, high quality, accurate trivia questions.
2. For each question, provide 4 options with only ONE objectively correct option.
3. Include an engaging, witty "hostIntroComment" (1 short sentence in your distinct persona introducing the question before the player answers).
4. Include a concise, intriguing "explanation" (1-2 sentences) revealing why the correct answer is true and a fun trivia factoid.
5. If search grounding is enabled, ensure facts are current, accurate, and reflect real-world knowledge up to today.

Return ONLY a valid JSON array of objects with the following schema:
[
  {
    "id": "q1",
    "question": "The question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why Option A is correct...",
    "hostIntroComment": "In your character's voice..."
  }
]
Output ONLY raw JSON. No markdown code blocks, no other text.`;

    let response;
    let groundingSources: Array<{ title: string; uri: string }> = [];

    if (useSearchGrounding) {
      // Use gemini-3.5-flash with googleSearch tool as required
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      // Extract grounding sources
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && Array.isArray(chunks)) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            groundingSources.push({
              title: chunk.web.title || 'Web Source',
              uri: chunk.web.uri,
            });
          }
        });
      }
    } else {
      // Fast generation without external search
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                hostIntroComment: { type: Type.STRING },
              },
              required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'hostIntroComment'],
            },
          },
        },
      });
    }

    const rawText = response.text || '[]';
    // Clean up possible markdown code fences if returned by search-grounded model
    const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    let questions = JSON.parse(cleanedJson);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format returned by AI');
    }

    // Attach grounding sources to the questions if available
    questions = questions.map((q: any, idx: number) => ({
      ...q,
      id: q.id || `q_${Date.now()}_${idx}`,
      category: customTopic || category,
      difficulty,
      groundingSources: groundingSources.slice(0, 3),
    }));

    res.json({ questions, groundingSources });
  } catch (error: any) {
    console.error('Error generating trivia round:', error);
    res.status(500).json({
      error: 'Failed to generate trivia questions',
      details: error?.message || String(error),
    });
  }
});

// 2. Generate Dynamic Host Reaction to User Answer
app.post('/api/trivia/host-reaction', async (req, res) => {
  try {
    const {
      hostSystemPrompt,
      hostName = 'AI Host',
      question,
      selectedOption,
      correctOption,
      isCorrect,
      streak = 0,
      score = 0,
    } = req.body;

    const prompt = `You are ${hostName}.
Persona instructions:
${hostSystemPrompt}

The player just answered this trivia question:
Question: "${question}"
Player's Answer: "${selectedOption}"
Correct Answer: "${correctOption}"
Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}
Current Streak: ${streak}
Current Score: ${score}

Give a quick, vivid, 1 to 2 sentence reaction to the player strictly in your character's voice.
React dynamically to whether they got it right or wrong, and optionally reference their streak or answer.
Be witty, immersive, and stay 100% in character.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: hostSystemPrompt,
        maxOutputTokens: 120,
        temperature: 1.0,
      },
    });

    const reactionText = response.text?.trim() || (isCorrect ? 'Well done!' : 'Not quite!');
    res.json({ reactionText });
  } catch (error: any) {
    console.error('Error generating host reaction:', error);
    res.status(500).json({ error: 'Failed to generate reaction', reactionText: '' });
  }
});

// 3. Text to Speech (TTS) using gemini-3.1-flash-tts-preview
app.post('/api/trivia/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Puck', hostTone = 'cheerful' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Call gemini-3.1-flash-tts-preview as mandated
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say with ${hostTone} energy: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName || 'Puck',
            },
          },
        },
      },
    });

    const pcmBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!pcmBase64) {
      throw new Error('No audio data received from TTS model');
    }

    // Convert raw 24kHz PCM to WAV format so all browsers can play it natively
    const wavBase64 = pcmToWav(pcmBase64, 24000, 1, 16);
    const audioUrl = `data:audio/wav;base64,${wavBase64}`;

    res.json({
      audioUrl,
      format: 'audio/wav',
      voice: voiceName,
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({
      error: 'TTS generation failed',
      details: error?.message || String(error),
    });
  }
});

// 4. Grounded Deep Dive / Fact Check using gemini-3.5-flash with googleSearch
app.post('/api/trivia/fact-check', async (req, res) => {
  try {
    const {
      question,
      correctAnswer,
      hostSystemPrompt = '',
      hostName = 'AI Host',
    } = req.body;

    const prompt = `You are ${hostName}. Provide a fascinating, up-to-date fact check and deep dive on this trivia topic.
Question: "${question}"
Answer: "${correctAnswer}"

Search Google for verified facts, recent developments, and intriguing historical/scientific context.
Provide a concise 2-3 sentence deep-dive breakdown in your unique persona, explaining why this is so interesting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: hostSystemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    const deepDiveText = response.text || '';
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((c: any) => ({
        title: c.web?.title || 'Web Reference',
        uri: c.web?.uri || '',
      }))
      .filter((s: any) => s.uri);

    res.json({ deepDiveText, sources });
  } catch (error: any) {
    console.error('Error during fact check:', error);
    res.status(500).json({ error: 'Fact check failed', details: error?.message });
  }
});

// ==========================================
// SERVER INITIALIZATION & WEBSOCKET SETUP
// ==========================================
async function startServer() {
  const httpServer = http.createServer(app);

  // WebSocket Server for Real-Time Live API voice conversations
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    const pathname = request.url?.split('?')[0];
    if (pathname === '/api/live-ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    let session: any = null;

    clientWs.on('message', async (rawMessage) => {
      try {
        const data = JSON.parse(rawMessage.toString());

        if (data.type === 'init') {
          const {
            hostSystemPrompt = 'You are a lively trivia host.',
            voiceName = 'Puck',
            hostName = 'AI Host',
          } = data;

          const systemInstruction = `You are ${hostName}, a charismatic trivia show host having a live, real-time voice conversation with the player!
Host personality:
${hostSystemPrompt}

Role and interaction rules:
- Speak directly, playfully, and conversationally in your persona.
- You can ask the player trivia questions, quiz them on their favorite topic, answer their trivia questions, give hints, or banter about their scores.
- Keep spoken answers concise (1-3 sentences) so the conversation flows naturally like an actual radio or TV gameshow.
- Be vibrant, responsive, and stay 100% in your personality!`;

          // Connect to gemini-3.1-flash-live-preview as mandated
          session = await ai.live.connect({
            model: 'gemini-3.1-flash-live-preview',
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' },
                },
              },
              systemInstruction,
            },
            callbacks: {
              onmessage: (message: any) => {
                // Audio chunk from Gemini Live
                const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audio && clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({ type: 'audio', audio }));
                }

                // Interrupted signal
                if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({ type: 'interrupted' }));
                }

                // Transcription if text part arrives
                const text = message.serverContent?.modelTurn?.parts?.map((p: any) => p.text).filter(Boolean).join('');
                if (text && clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({ type: 'text', text }));
                }
              },
              onclose: () => {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({ type: 'status', status: 'closed' }));
                }
              },
              onerror: (err: any) => {
                console.error('Live API session error:', err);
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({ type: 'error', error: String(err) }));
                }
              },
            },
          });

          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'ready', hostName }));
          }
        } else if (data.type === 'audio' && session) {
          // Send user mic audio chunk (16kHz PCM little endian) to Gemini Live
          await session.sendRealtimeInput({
            audio: { data: data.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (data.type === 'text' && session) {
          // Send text message into Live session
          await session.sendRealtimeInput({ text: data.text });
        }
      } catch (err: any) {
        console.error('Live WS handling error:', err);
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ type: 'error', error: err?.message || String(err) }));
        }
      }
    });

    clientWs.on('close', () => {
      if (session) {
        try {
          session.close();
        } catch (_) {}
      }
    });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Trivia Host server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
