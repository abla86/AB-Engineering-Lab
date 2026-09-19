import React, { useEffect, useState } from 'react';
import {
  Search,
  ExternalLink,
  Sparkles,
  Volume2,
  X,
  Globe2,
  Loader2,
} from 'lucide-react';
import { HostPersonality, TriviaQuestion } from '../types';

interface FactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: TriviaQuestion;
  host: HostPersonality;
  onPlayTTS?: (text: string) => void;
  isPlayingTTS?: boolean;
}

export const FactCheckModal: React.FC<FactCheckModalProps> = ({
  isOpen,
  onClose,
  question,
  host,
  onPlayTTS,
  isPlayingTTS = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [deepDiveText, setDeepDiveText] = useState<string>('');
  const [sources, setSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setDeepDiveText('');
    setSources([]);

    const fetchFactCheck = async () => {
      try {
        const res = await fetch('/api/trivia/fact-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question.question,
            correctAnswer: question.options[question.correctIndex],
            hostSystemPrompt: host.systemPrompt,
            hostName: host.name,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Fact check failed');
        }
        if (isMounted) {
          setDeepDiveText(data.deepDiveText);
          setSources(data.sources || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch grounded search data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFactCheck();

    return () => {
      isMounted = false;
    };
  }, [isOpen, question, host]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-7 text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Google Search Grounded Fact Check
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  Gemini 3.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verified real-time information curated by {host.name}
              </p>
            </div>
          </div>
          <button
            id="close-fact-check-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/70">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Subject Question
            </span>
            <p className="text-sm font-medium text-slate-200">{question.question}</p>
            <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span>Verified Answer:</span>
              <span className="text-slate-100 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/60">
                {question.options[question.correctIndex]}
              </span>
            </div>
          </div>

          {/* Deep dive host breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {host.name}&apos;s Fact Breakdown
              </span>
              {deepDiveText && onPlayTTS && (
                <button
                  id="speak-fact-check-btn"
                  type="button"
                  onClick={() => onPlayTTS(deepDiveText)}
                  disabled={isPlayingTTS}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors text-xs flex items-center gap-1"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingTTS ? 'animate-bounce text-amber-400' : ''}`} />
                  <span className="text-[10px]">Speak with Host Voice</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs">Searching Google and synthesizing with {host.name}...</span>
              </div>
            ) : error ? (
              <div className="text-xs text-rose-400 py-2">{error}</div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {deepDiveText || question.explanation}
              </p>
            )}
          </div>

          {/* Web Grounding Sources */}
          {sources.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                Google Search Citations & References
              </span>
              <div className="space-y-1.5">
                {sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/50 text-xs text-cyan-300 hover:text-cyan-200 transition-all group"
                  >
                    <span className="truncate pr-2 font-medium">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            id="done-fact-check-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
