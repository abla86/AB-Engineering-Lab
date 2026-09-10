import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
  Radio,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { HostPersonality, PlayerAnswerRecord } from '../types';
import { HostAvatar } from './HostAvatar';

interface RoundSummaryProps {
  host: HostPersonality;
  score: number;
  bestStreak: number;
  records: PlayerAnswerRecord[];
  onPlayAgain: () => void;
  onChangeHost: () => void;
  onOpenLiveVoice: () => void;
  onPlayTTS: (text: string) => void;
  isPlayingTTS: boolean;
  hostFinalCommentary: string;
}

export const RoundSummary: React.FC<RoundSummaryProps> = ({
  host,
  score,
  bestStreak,
  records,
  onPlayAgain,
  onChangeHost,
  onOpenLiveVoice,
  onPlayTTS,
  isPlayingTTS,
  hostFinalCommentary,
}) => {
  const correctCount = records.filter((r) => r.isCorrect).length;
  const totalCount = records.length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  useEffect(() => {
    // Trigger celebratory confetti if player did well (>= 60%)
    if (accuracy >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#06b6d4', '#ec4899', '#10b981'],
        });
      } catch (_) {}
    }
  }, [accuracy]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          Trivia Round Complete
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Match Performance Breakdown
        </h1>
      </div>

      {/* Host Final Commentary Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-5 mb-8">
        <HostAvatar host={host} size="lg" isSpeaking={isPlayingTTS} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">{host.name}</span>
              <span className="text-xs text-amber-400 font-medium">
                {host.title}
              </span>
            </div>

            {hostFinalCommentary && (
              <button
                id="speak-summary-host-btn"
                type="button"
                onClick={() => onPlayTTS(hostFinalCommentary)}
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
            )}
          </div>
          <p className="text-sm text-slate-200 leading-relaxed italic font-serif mt-2">
            &ldquo;{hostFinalCommentary}&rdquo;
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Final Score
          </span>
          <span className="text-3xl font-extrabold text-amber-400">
            {score} PTS
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Accuracy
          </span>
          <span className="text-3xl font-extrabold text-emerald-400">
            {correctCount}/{totalCount} ({accuracy}%)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Longest Streak
          </span>
          <span className="text-3xl font-extrabold text-orange-400 flex items-center justify-center gap-1">
            <Flame className="w-6 h-6 text-orange-500" />
            {bestStreak}x
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          id="play-again-btn"
          type="button"
          onClick={onPlayAgain}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Another Round</span>
        </button>

        <button
          id="change-host-btn"
          type="button"
          onClick={onChangeHost}
          className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          <span>Change Host</span>
        </button>

        <button
          id="live-voice-room-summary-btn"
          type="button"
          onClick={onOpenLiveVoice}
          className="px-5 py-3 rounded-2xl bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 font-semibold text-sm border border-cyan-800/60 transition-all flex items-center gap-2"
        >
          <Radio className="w-4 h-4" />
          <span>Voice Chat with {host.name} (Live API)</span>
        </button>
      </div>

      {/* Question Details List */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
          Question Review & Solutions
        </h3>

        <div className="space-y-3">
          {records.map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                rec.isCorrect
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                  : 'bg-rose-950/20 border-rose-800/40 text-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {rec.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-snug">
                    {idx + 1}. {rec.question}
                  </p>

                  <div className="mt-2 text-xs flex flex-wrap gap-4 text-slate-300">
                    <div>
                      <span className="text-slate-400">Your Answer: </span>
                      <span
                        className={
                          rec.isCorrect
                            ? 'text-emerald-300 font-semibold'
                            : 'text-rose-300 line-through font-semibold'
                        }
                      >
                        {rec.selectedIndex >= 0 ? `Option ${['A','B','C','D'][rec.selectedIndex]}` : 'Timed Out'}
                      </span>
                    </div>

                    {!rec.isCorrect && (
                      <div>
                        <span className="text-slate-400">Correct: </span>
                        <span className="text-emerald-300 font-semibold">
                          Option {['A','B','C','D'][rec.correctIndex]}
                        </span>
                      </div>
                    )}

                    <div className="text-amber-400 font-medium ml-auto">
                      +{rec.pointsEarned} PTS
                    </div>
                  </div>

                  {rec.hostReaction && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 text-xs italic text-slate-400 font-serif">
                      {host.name}: &ldquo;{rec.hostReaction}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
