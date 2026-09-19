import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Sparkles,
  Radio,
  AlertCircle,
  MessageSquare,
  Flame,
} from 'lucide-react';
import { HostPersonality } from '../types';
import { HostAvatar } from './HostAvatar';
import { float32To16BitPCMBase64, LiveAudioStreamPlayer } from '../utils/audio';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  host: HostPersonality;
}

interface TranscriptItem {
  id: string;
  sender: 'user' | 'host';
  text: string;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  host,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'listening' | 'speaking' | 'error' | 'closed'
  >('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [activeSpeechWave, setActiveSpeechWave] = useState<number[]>([15, 25, 40, 20, 35, 18]);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const livePlayerRef = useRef<LiveAudioStreamPlayer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Quick conversation prompts
  const starterPrompts = [
    `Give me a rapid-fire trivia question right now!`,
    `Tell me a mind-bending trivia fact in your signature style!`,
    `What is the most bizarre fact in human history?`,
    `Roast my trivia knowledge!`,
  ];

  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;
    setConnectionStatus('connecting');
    setErrorMessage(null);
    setTranscripts([
      {
        id: 'initial',
        sender: 'host',
        text: `Connected to ${host.name} via Gemini 3.1 Flash Live API. Speak into your microphone to chat!`,
      },
    ]);

    const livePlayer = new LiveAudioStreamPlayer();
    livePlayerRef.current = livePlayer;

    // Connect WebSocket to server
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isSubscribed) return;
      // Initialize Live API session with Host parameters
      ws.send(
        JSON.stringify({
          type: 'init',
          hostSystemPrompt: host.systemPrompt,
          voiceName: host.voiceName,
          hostName: host.name,
        })
      );
    };

    ws.onmessage = (event) => {
      if (!isSubscribed) return;
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'ready') {
          setConnectionStatus('connected');
          startMicCapture();
        } else if (data.type === 'audio') {
          // Play incoming 24kHz audio from gemini-3.1-flash-live-preview
          setConnectionStatus('speaking');
          livePlayer.enqueuePcmChunk(data.audio);
        } else if (data.type === 'interrupted') {
          livePlayer.stopAll();
          setConnectionStatus('listening');
        } else if (data.type === 'text') {
          setTranscripts((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.sender === 'host' && last.id !== 'initial') {
              return [
                ...prev.slice(0, -1),
                { ...last, text: last.text + ' ' + data.text },
              ];
            }
            return [
              ...prev,
              { id: `t_${Date.now()}`, sender: 'host', text: data.text },
            ];
          });
        } else if (data.type === 'error') {
          console.error('Live API WS error:', data.error);
          setErrorMessage(data.error);
          setConnectionStatus('error');
        }
      } catch (err) {
        console.error('Error parsing live WS message:', err);
      }
    };

    ws.onerror = (e) => {
      console.error('WebSocket encountered an error:', e);
      if (isSubscribed) {
        setErrorMessage('Unable to connect to Live API server.');
        setConnectionStatus('error');
      }
    };

    ws.onclose = () => {
      if (isSubscribed) {
        setConnectionStatus('closed');
      }
    };

    // Waveform visualizer loop
    const updateWave = () => {
      if (livePlayer.analyser) {
        const dataArray = new Uint8Array(livePlayer.analyser.frequencyBinCount);
        livePlayer.analyser.getByteFrequencyData(dataArray);
        const wave = [
          Math.max(10, (dataArray[1] || 0) / 3),
          Math.max(10, (dataArray[3] || 0) / 2.5),
          Math.max(10, (dataArray[5] || 0) / 2),
          Math.max(10, (dataArray[7] || 0) / 2.2),
          Math.max(10, (dataArray[9] || 0) / 2.8),
          Math.max(10, (dataArray[11] || 0) / 3.2),
        ];
        setActiveSpeechWave(wave);
      }
      animationFrameRef.current = requestAnimationFrame(updateWave);
    };
    animationFrameRef.current = requestAnimationFrame(updateWave);

    return () => {
      isSubscribed = false;
      cleanup();
    };
  }, [isOpen, host]);

  const startMicCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      source.connect(processor);
      processor.connect(audioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (isMuted) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Check if there is actual sound volume
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);

        if (rms > 0.015) {
          setConnectionStatus('listening');
        }

        const base64Audio = float32To16BitPCMBase64(inputData);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'audio',
              audio: base64Audio,
            })
          );
        }
      };

      setConnectionStatus('listening');
    } catch (err: any) {
      console.error('Error starting mic capture:', err);
      setErrorMessage(
        'Microphone access denied or unavailable. Please enable microphone permissions in your browser settings.'
      );
      setConnectionStatus('error');
    }
  };

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (livePlayerRef.current) {
      livePlayerRef.current.close();
      livePlayerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleInterrupt = () => {
    if (livePlayerRef.current) {
      livePlayerRef.current.stopAll();
    }
    setConnectionStatus('listening');
  };

  const handleSendPromptText = (text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setTranscripts((prev) => [
        ...prev,
        { id: `u_${Date.now()}`, sender: 'user', text },
      ]);
      wsRef.current.send(JSON.stringify({ type: 'text', text }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Live Voice Room with {host.name}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/60">
                  Gemini 3.1 Live API
                </span>
              </div>
              <p className="text-xs text-slate-400">{host.title}</p>
            </div>
          </div>

          <button
            id="close-live-voice-room-btn"
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 border border-slate-700 transition-all flex items-center gap-1 text-xs"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>

        {/* Center Stage Avatar & Realtime Waves */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative">
            <HostAvatar
              host={host}
              isSpeaking={connectionStatus === 'speaking'}
              size="lg"
            />
          </div>

          {/* Dynamic Audio Visualizer Bar */}
          <div className="mt-4 flex items-center gap-1.5 h-8">
            {activeSpeechWave.map((h, i) => (
              <div
                key={i}
                style={{ height: `${connectionStatus === 'speaking' ? h : 6}px` }}
                className={`w-1.5 rounded-full transition-all duration-75 ${
                  connectionStatus === 'speaking'
                    ? 'bg-gradient-to-t from-cyan-500 to-amber-400'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Status badge */}
          <div className="mt-3">
            {connectionStatus === 'connecting' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Connecting to Live Voice Stream...
              </span>
            )}
            {connectionStatus === 'connected' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Ready! Say hello to {host.name}...
              </span>
            )}
            {connectionStatus === 'listening' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <Mic className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Host is listening...
              </span>
            )}
            {connectionStatus === 'speaking' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Volume2 className="w-3.5 h-3.5 animate-bounce text-amber-400" />
                {host.name} is speaking...
              </span>
            )}
            {connectionStatus === 'error' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMessage || 'Connection issue'}
              </span>
            )}
          </div>
        </div>

        {/* Conversation transcript scroll */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-950/70 border border-slate-800/80 p-3 sm:p-4 space-y-2.5 min-h-[140px] text-xs">
          {transcripts.map((item) => (
            <div
              key={item.id}
              className={`flex gap-2.5 ${
                item.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {item.sender === 'host' && (
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested prompts */}
        <div className="mt-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Suggested Prompts:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {starterPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendPromptText(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/80 text-[11px] transition-all truncate max-w-full"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="toggle-mic-mute-btn"
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-xl border font-medium text-xs flex items-center gap-2 transition-all ${
                isMuted
                  ? 'bg-rose-900/40 text-rose-300 border-rose-700/60 hover:bg-rose-900/60'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Unmute Mic' : 'Mic Active'}</span>
            </button>

            {connectionStatus === 'speaking' && (
              <button
                id="interrupt-live-speech-btn"
                type="button"
                onClick={handleInterrupt}
                className="p-3 rounded-xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Flame className="w-4 h-4" />
                Interrupt Host
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block text-right">
            <span>Low-latency audio via WebSocket</span>
          </div>
        </div>
      </div>
    </div>
  );
};
