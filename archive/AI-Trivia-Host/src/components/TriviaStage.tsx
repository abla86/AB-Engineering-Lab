import React, { useEffect, useState } from 'react';
import {
  Flame,
  Trophy,
  Timer,
  Volume2,
  Radio,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { HostPersonality, TriviaQuestion, PlayerAnswerRecord } from '../types';
import { HostAvatar } from './HostAvatar';

interface TriviaStageProps {
  host: HostPersonality;
  question: TriviaQuestion;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  timeLimit: number;
  onAnswer: (selectedIndex: number, timeSpent: number) => void;
  onNextQuestion: () => void;
  onOpenFactCheck: () => void;
  onOpenLiveVoice: () => void;
  onPlayTTS: (text: string) => void;
  isPlayingTTS: boolean;
  activeReaction: string | null;
  selectedAnswer: number | null;
  isAnswerSubmitted: boolean;
}

export const TriviaStage: React.FC<TriviaStageProps> = ({
  host,
  question,
  currentIndex,
  totalQuestions,
  score,
  streak,
  timeLimit,
  onAnswer,
  onNextQuestion,
  onOpenFactCheck,
  onOpenLiveVoice,
  onPlayTTS,
  isPlayingTTS,
  activeReaction,
  selectedAnswer,
  isAnswerSubmitted,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit || 20);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(timeLimit || 20);
    setStartTime(Date.now());
  }, [question, timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (timeLimit <= 0 || isAnswerSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time expired! Auto-submit timeout
          onAnswer(-1, timeLimit);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, isAnswerSubmitted, onAnswer]);

  // Keyboard shortcut listener (A, B, C, D or 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswerSubmitted) {
        if (e.key === 'Enter' || e.key === ' ') {
          onNextQuestion();
        }
        return;
      }

      const key = e.key.toUpperCase();
      const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      if (key === 'A' || key === '1') onAnswer(0, timeSpent);
      if (key === 'B' || key === '2') onAnswer(1, timeSpent);
      if (key === 'C' || key === '3') onAnswer(2, timeSpent);
      if (key === 'D' || key === '4') onAnswer(3, timeSpent);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerSubmitted, onAnswer, onNextQuestion, startTime]);

  const optionLabels = ['A', 'B', 'C', 'D'];

  const timerPercentage = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Top HUD: Score, Streak, Progress, Live Voice button */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{score} PTS</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold text-xs animate-pulse">
              <Flame className="w-3.5 h-3.5" />
              <span>{streak}x Streak</span>
            </div>
          )}
        </div>

        {/* Progress & Category */}
        <div className="text-center">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-[200px] inline-block">
            {question.category}
          </span>
        </div>

        {/* Live Voice button */}
        <button
          id="open-live-voice-stage-btn"
          type="button"
          onClick={onOpenLiveVoice}
          title="Talk with the Host via Live Voice (Gemini Live API)"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-800/60 text-xs font-semibold shadow-sm transition-all"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Talk Live</span>
        </button>
      </div>

      {/* Host Commentary Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-start gap-4 mb-6">
        <HostAvatar host={host} size="md" isSpeaking={isPlayingTTS} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{host.name}</span>
              <span className="text-[10px] text-amber-400/90 font-medium">
                {host.title}
              </span>
            </div>

            <button
              id="replay-host-tts-btn"
              type="button"
              onClick={() =>
                onPlayTTS(
                  isAnswerSubmitted && activeReaction
                    ? activeReaction
                    : `${question.hostIntroComment} ${question.question}`
                )
              }
              title="Speak with Host Voice (Gemini TTS)"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors text-xs flex items-center gap-1"
            >
              <Volume2
                className={`w-3.5 h-3.5 ${
                  isPlayingTTS ? 'animate-bounce text-amber-400' : ''
                }`}
              />
              <span className="text-[10px] hidden sm:inline">
                {isPlayingTTS ? 'Speaking...' : 'Listen'}
              </span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-serif">
            {isAnswerSubmitted && activeReaction
              ? `"${activeReaction}"`
              : `"${question.hostIntroComment}"`}
          </p>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="relative rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Timer line (if timed) */}
        {timeLimit > 0 && !isAnswerSubmitted && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800 rounded-t-3xl overflow-hidden">
            <div
              style={{ width: `${timerPercentage}%` }}
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>
        )}

        {/* Question metadata & Timer Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
              {question.difficulty}
            </span>
            {question.groundingSources && question.groundingSources.length > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center gap-1">
                <Search className="w-3 h-3" />
                Search Grounded
              </span>
            )}
          </div>

          {timeLimit > 0 && !isAnswerSubmitted && (
            <div
              className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-xl ${
                timeLeft <= 5
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-bounce'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Question Title */}
        <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-6">
          {question.question}
        </h2>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {question.options.map((opt, idx) => {
            const isCorrect = idx === question.correctIndex;
            const isSelected = idx === selectedAnswer;

            let buttonStyle =
              'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-750 hover:border-slate-600';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                buttonStyle =
                  'bg-emerald-950/80 text-emerald-100 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-900/30';
              } else if (isSelected && !isCorrect) {
                buttonStyle =
                  'bg-rose-950/80 text-rose-100 border-rose-500 ring-2 ring-rose-500/40';
              } else {
                buttonStyle = 'bg-slate-900/50 text-slate-500 border-slate-800 opacity-60';
              }
            } else if (isSelected) {
              buttonStyle =
                'bg-amber-500/20 text-white border-amber-400 ring-2 ring-amber-400/40';
            }

            return (
              <button
                key={idx}
                id={`option-btn-${idx}`}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => {
                  const timeSpent = Math.max(
                    1,
                    Math.round((Date.now() - startTime) / 1000)
                  );
                  onAnswer(idx, timeSpent);
                }}
                className={`p-4 rounded-2xl border text-left font-medium text-sm sm:text-base transition-all duration-150 flex items-center justify-between ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isAnswerSubmitted && isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : isAnswerSubmitted && isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {optionLabels[idx]}
                  </span>
                  <span className="leading-snug">{opt}</span>
                </div>

                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Section (after answer submitted) */}
        {isAnswerSubmitted && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Lore & Explanation
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>

            {/* Citations & Fact Check buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                id="open-fact-check-btn"
                type="button"
                onClick={onOpenFactCheck}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 text-xs font-semibold transition-all shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Grounded Fact Check & Sources</span>
              </button>

              <button
                id="next-question-btn"
                type="button"
                onClick={onNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 ml-auto"
              >
                <span>
                  {currentIndex + 1 >= totalQuestions
                    ? 'View Final Results'
                    : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
