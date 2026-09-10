import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  Radio,
  Volume2,
  VolumeX,
  RotateCcw,
  Loader2,
  Search,
} from 'lucide-react';
import { HostPersonality, GameSettings, TriviaQuestion, PlayerAnswerRecord, GameStage } from './types';
import { PRESET_HOSTS } from './data/hosts';
import { HostSelector } from './components/HostSelector';
import { GameSetup } from './components/GameSetup';
import { TriviaStage } from './components/TriviaStage';
import { RoundSummary } from './components/RoundSummary';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { CustomHostModal } from './components/CustomHostModal';
import { FactCheckModal } from './components/FactCheckModal';
import { playSoundEffect } from './utils/audio';

export default function App() {
  // Hosts management
  const [hosts, setHosts] = useState<HostPersonality[]>(() => {
    try {
      const saved = localStorage.getItem('custom_trivia_hosts');
      if (saved) {
        const customHosts = JSON.parse(saved);
        return [...PRESET_HOSTS, ...customHosts];
      }
    } catch (_) {}
    return PRESET_HOSTS;
  });

  const [selectedHost, setSelectedHost] = useState<HostPersonality>(PRESET_HOSTS[0]);
  const [stage, setStage] = useState<GameStage>('select_host');
  const [settings, setSettings] = useState<GameSettings | null>(null);

  // Gameplay state
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [records, setRecords] = useState<PlayerAnswerRecord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [hostFinalCommentary, setHostFinalCommentary] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);

  // Audio & Modals state
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const [playingVoiceHostId, setPlayingVoiceHostId] = useState<string | null>(null);
  const [isVoiceLoading, setIsVoiceLoading] = useState<boolean>(false);
  const [globalMute, setGlobalMute] = useState<boolean>(false);

  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState<boolean>(false);
  const [isCustomHostModalOpen, setIsCustomHostModalOpen] = useState<boolean>(false);
  const [isFactCheckOpen, setIsFactCheckOpen] = useState<boolean>(false);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio when unmounting
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Text-To-Speech playback helper
  const playTTS = async (text: string, voiceName = selectedHost.voiceName, hostId?: string) => {
    if (globalMute || !text) return;

    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      setIsVoiceLoading(true);
      if (hostId) setPlayingVoiceHostId(hostId);
      setIsPlayingTTS(true);

      const res = await fetch('/api/trivia/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName,
          hostName: selectedHost.name,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioUrl) {
        throw new Error(data.error || 'TTS error');
      }

      const audio = new Audio(data.audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsPlayingTTS(false);
        setPlayingVoiceHostId(null);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlayingTTS(false);
        setPlayingVoiceHostId(null);
        currentAudioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error('TTS playback error:', err);
      setIsPlayingTTS(false);
      setPlayingVoiceHostId(null);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  // Preview host voice from the selector
  const handlePreviewVoice = async (host: HostPersonality) => {
    if (playingVoiceHostId === host.id && isPlayingTTS) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setIsPlayingTTS(false);
      setPlayingVoiceHostId(null);
      return;
    }
    await playTTS(host.catchphrase, host.voiceName, host.id);
  };

  // Save new custom host
  const handleSaveCustomHost = (newHost: HostPersonality) => {
    const updated = [...hosts, newHost];
    setHosts(updated);
    setSelectedHost(newHost);
    try {
      const customOnly = updated.filter((h) => h.isCustom);
      localStorage.setItem('custom_trivia_hosts', JSON.stringify(customOnly));
    } catch (_) {}
  };

  // Launch trivia game round
  const handleStartGame = async (gameSettings: GameSettings) => {
    setSettings(gameSettings);
    setStage('loading_round');
    setLoadError(null);
    playSoundEffect('click');

    try {
      const res = await fetch('/api/trivia/generate-round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: gameSettings.category,
          customTopic: gameSettings.customTopic,
          difficulty: gameSettings.difficulty,
          questionCount: gameSettings.questionCount,
          hostSystemPrompt: selectedHost.systemPrompt,
          hostName: selectedHost.name,
          useSearchGrounding: gameSettings.enableSearchGrounding,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.questions || data.questions.length === 0) {
        throw new Error(data.error || data.details || 'Failed to generate questions');
      }

      setQuestions(data.questions);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      setBestStreak(0);
      setRecords([]);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setActiveReaction(null);
      setStage('question_active');

      // Auto-read first question intro if TTS enabled
      if (gameSettings.enableTTS && !globalMute) {
        const firstQ = data.questions[0];
        playTTS(`${firstQ.hostIntroComment} ${firstQ.question}`);
      }
    } catch (err: any) {
      console.error('Error generating game:', err);
      setLoadError(err?.message || 'Failed to generate trivia questions. Please try again.');
      setStage('select_settings');
    }
  };

  // Player answers a question
  const handleAnswer = async (selectedIndex: number, timeSpent: number) => {
    if (isAnswerSubmitted || !questions[currentIndex]) return;

    setIsAnswerSubmitted(true);
    setSelectedAnswer(selectedIndex);

    const q = questions[currentIndex];
    const isCorrect = selectedIndex === q.correctIndex;

    // Calculate points
    let points = 0;
    if (isCorrect) {
      const basePoints =
        q.difficulty === 'Casual' ? 100 : q.difficulty === 'Challenging' ? 200 : 300;
      const streakBonus = streak * 25;
      const timeBonus = settings?.timePerQuestion
        ? Math.max(0, (settings.timePerQuestion - timeSpent) * 5)
        : 0;
      points = basePoints + streakBonus + timeBonus;

      setScore((s) => s + points);
      setStreak((st) => {
        const newStreak = st + 1;
        setBestStreak((b) => Math.max(b, newStreak));
        return newStreak;
      });
      playSoundEffect('correct');
    } else {
      setStreak(0);
      playSoundEffect('wrong');
    }

    // Call server to generate host reaction in character
    try {
      const res = await fetch('/api/trivia/host-reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostSystemPrompt: selectedHost.systemPrompt,
          hostName: selectedHost.name,
          question: q.question,
          selectedOption: selectedIndex >= 0 ? q.options[selectedIndex] : 'Timed Out',
          correctOption: q.options[q.correctIndex],
          isCorrect,
          streak: isCorrect ? streak + 1 : 0,
          score: isCorrect ? score + points : score,
        }),
      });

      const data = await res.json();
      const reaction = data.reactionText || (isCorrect ? 'Splendid answer!' : 'A grievous miss!');
      setActiveReaction(reaction);

      // Record answer
      const record: PlayerAnswerRecord = {
        questionId: q.id,
        question: q.question,
        selectedIndex,
        correctIndex: q.correctIndex,
        isCorrect,
        timeSpentSeconds: timeSpent,
        pointsEarned: points,
        hostReaction: reaction,
      };
      setRecords((prev) => [...prev, record]);

      // Play reaction audio if TTS is enabled
      if (settings?.enableTTS && !globalMute) {
        playTTS(reaction);
      }
    } catch (e) {
      const fallback = isCorrect ? 'Spot on!' : 'Not quite right!';
      setActiveReaction(fallback);
      setRecords((prev) => [
        ...prev,
        {
          questionId: q.id,
          question: q.question,
          selectedIndex,
          correctIndex: q.correctIndex,
          isCorrect,
          timeSpentSeconds: timeSpent,
          pointsEarned: points,
          hostReaction: fallback,
        },
      ]);
    }
  };

  // Advance to next question or round summary
  const handleNextQuestion = async () => {
    playSoundEffect('click');
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setActiveReaction(null);

      const nextQ = questions[nextIdx];
      if (settings?.enableTTS && !globalMute) {
        playTTS(`${nextQ.hostIntroComment} ${nextQ.question}`);
      }
    } else {
      // Game completed!
      playSoundEffect('fanfare');
      setStage('game_over');

      // Generate host closing commentary
      const finalAccuracy = Math.round(
        (records.filter((r) => r.isCorrect).length / questions.length) * 100
      );
      let summaryRemarks = `${selectedHost.name}'s final verdict: `;
      if (finalAccuracy >= 80) {
        summaryRemarks += `Outstanding performance! You have proven yourself a veritable titan of trivia knowledge!`;
      } else if (finalAccuracy >= 50) {
        summaryRemarks += `A valiant effort! With a bit more preparation, you shall conquer the highest heights of trivia!`;
      } else {
        summaryRemarks += `A humbling round indeed! Do not despair; return to your studies and face my questions once more!`;
      }
      setHostFinalCommentary(summaryRemarks);

      if (settings?.enableTTS && !globalMute) {
        playTTS(summaryRemarks);
      }
    }
  };

  const handleStartLiveVoiceDirect = (host: HostPersonality) => {
    setSelectedHost(host);
    setIsLiveVoiceOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Universal Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            id="brand-header"
            onClick={() => setStage('select_host')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">
                  AI Trivia Host
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase">
                  Live & Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI Host: <span className="text-amber-400 font-medium">{selectedHost.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Voice Room Direct Button */}
            <button
              id="header-live-voice-btn"
              type="button"
              onClick={() => setIsLiveVoiceOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span className="hidden sm:inline">Talk with Host (Live API)</span>
              <span className="sm:hidden">Voice</span>
            </button>

            {/* Global TTS Audio Mute Toggle */}
            <button
              id="toggle-global-audio-btn"
              type="button"
              onClick={() => {
                if (!globalMute && currentAudioRef.current) {
                  currentAudioRef.current.pause();
                }
                setGlobalMute(!globalMute);
              }}
              title={globalMute ? 'Unmute AI Host Voice' : 'Mute AI Host Voice'}
              className={`p-2 rounded-xl border text-xs transition-all ${
                globalMute
                  ? 'bg-slate-800 text-slate-500 border-slate-700'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {globalMute ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col justify-center">
        {stage === 'select_host' && (
          <HostSelector
            hosts={hosts}
            selectedHostId={selectedHost.id}
            onSelectHost={(host) => {
              setSelectedHost(host);
              setStage('select_settings');
              playSoundEffect('click');
            }}
            onOpenCustomHostModal={() => setIsCustomHostModalOpen(true)}
            onPreviewVoice={handlePreviewVoice}
            isLoadingVoice={isVoiceLoading}
            playingVoiceHostId={playingVoiceHostId}
            onStartLiveVoiceDirect={handleStartLiveVoiceDirect}
          />
        )}

        {stage === 'select_settings' && (
          <GameSetup
            host={selectedHost}
            onBackToHosts={() => setStage('select_host')}
            onStartGame={handleStartGame}
            onStartLiveVoice={(host) => {
              setSelectedHost(host);
              setIsLiveVoiceOpen(true);
            }}
          />
        )}

        {stage === 'loading_round' && (
          <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-amber-600 to-indigo-950 flex items-center justify-center text-amber-300 shadow-xl">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {selectedHost.name} is Curating Questions...
            </h2>
            <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Consulting Google Search grounding for real-time verification and writing custom
              banter in character.
            </p>
          </div>
        )}

        {stage === 'question_active' && questions[currentIndex] && (
          <TriviaStage
            host={selectedHost}
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            score={score}
            streak={streak}
            timeLimit={settings?.timePerQuestion || 0}
            onAnswer={handleAnswer}
            onNextQuestion={handleNextQuestion}
            onOpenFactCheck={() => setIsFactCheckOpen(true)}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
            onPlayTTS={(text) => playTTS(text)}
            isPlayingTTS={isPlayingTTS}
            activeReaction={activeReaction}
            selectedAnswer={selectedAnswer}
            isAnswerSubmitted={isAnswerSubmitted}
          />
        )}

        {stage === 'game_over' && (
          <RoundSummary
            host={selectedHost}
            score={score}
            bestStreak={bestStreak}
            records={records}
            onPlayAgain={() => {
              if (settings) handleStartGame(settings);
            }}
            onChangeHost={() => setStage('select_host')}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
            onPlayTTS={(text) => playTTS(text)}
            isPlayingTTS={isPlayingTTS}
            hostFinalCommentary={hostFinalCommentary}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="py-4 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>AI Voice: Gemini 3.1 Flash TTS Preview</span>
          <span>Live Conversation: Gemini 3.1 Flash Live Preview</span>
          <span>Search Grounding: Gemini 3.5 Flash &amp; Google Search</span>
        </div>
      </footer>

      {/* Modals */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        host={selectedHost}
      />

      <CustomHostModal
        isOpen={isCustomHostModalOpen}
        onClose={() => setIsCustomHostModalOpen(false)}
        onSaveHost={handleSaveCustomHost}
      />

      {stage === 'question_active' && questions[currentIndex] && (
        <FactCheckModal
          isOpen={isFactCheckOpen}
          onClose={() => setIsFactCheckOpen(false)}
          question={questions[currentIndex]}
          host={selectedHost}
          onPlayTTS={(text) => playTTS(text)}
          isPlayingTTS={isPlayingTTS}
        />
      )}
    </div>
  );
}
