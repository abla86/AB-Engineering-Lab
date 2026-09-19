import React, { useState } from 'react';
import {
  Globe2,
  Film,
  Sparkles,
  BookOpen,
  MapPin,
  Gamepad2,
  Utensils,
  Wand2,
  Volume2,
  Search,
  Timer,
  Play,
  Radio,
  ArrowLeft,
} from 'lucide-react';
import { HostPersonality, GameSettings } from '../types';
import { TRIVIA_CATEGORIES } from '../data/hosts';
import { HostAvatar } from './HostAvatar';

interface GameSetupProps {
  host: HostPersonality;
  onBackToHosts: () => void;
  onStartGame: (settings: GameSettings) => void;
  onStartLiveVoice: (host: HostPersonality) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({
  host,
  onBackToHosts,
  onStartGame,
  onStartLiveVoice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(TRIVIA_CATEGORIES[0].id);
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Casual' | 'Challenging' | 'Mastermind'>('Challenging');
  const [enableTTS, setEnableTTS] = useState(true);
  const [enableSearchGrounding, setEnableSearchGrounding] = useState(true);
  const [timeLimit, setTimeLimit] = useState(20);

  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4' };
    switch (iconName) {
      case 'Globe2':
        return <Globe2 {...props} />;
      case 'Film':
        return <Film {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'MapPin':
        return <MapPin {...props} />;
      case 'Gamepad2':
        return <Gamepad2 {...props} />;
      case 'Utensils':
        return <Utensils {...props} />;
      case 'Wand2':
      default:
        return <Wand2 {...props} />;
    }
  };

  const handleLaunch = () => {
    const activeCategoryObj = TRIVIA_CATEGORIES.find((c) => c.id === selectedCategory);
    const categoryName = activeCategoryObj?.name || 'General Trivia';

    const settings: GameSettings = {
      hostId: host.id,
      category: categoryName,
      customTopic: selectedCategory === 'custom' ? customTopic : undefined,
      difficulty,
      questionCount: 5,
      enableTTS,
      enableSearchGrounding,
      timePerQuestion: timeLimit,
    };

    onStartGame(settings);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Back button & Title */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="back-to-hosts-btn"
          type="button"
          onClick={onBackToHosts}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Change Host
        </button>

        <button
          id="live-voice-room-setup-btn"
          type="button"
          onClick={() => onStartLiveVoice(host)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 text-xs font-semibold transition-all shadow-sm"
        >
          <Radio className="w-3.5 h-3.5" />
          Talk Live with {host.name} (Live API)
        </button>
      </div>

      {/* Selected Host Banner */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-5 mb-8">
        <HostAvatar host={host} size="lg" />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
              {host.badge}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Voice: {host.voiceName}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {host.name}
          </h2>
          <p className="text-xs text-amber-400/90 font-medium">{host.title}</p>
          <p className="mt-2 text-xs text-slate-300 italic font-serif max-w-xl">
            &ldquo;{host.catchphrase}&rdquo;
          </p>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="space-y-6">
        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            1. Select Trivia Realm
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {TRIVIA_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`category-btn-${cat.id}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400/80 text-white ring-2 ring-amber-400/30'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-amber-300'
                      }`}
                    >
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <span className="font-semibold text-xs leading-tight">
                      {cat.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Custom Topic Input if selected */}
          {selectedCategory === 'custom' && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-900 border border-amber-400/40">
              <label className="block text-xs font-medium text-amber-300 mb-1">
                Enter Custom Trivia Topic:
              </label>
              <input
                id="custom-topic-input"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., 90s Hip Hop, Quantum Physics, Marvel MCU, Studio Ghibli"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-amber-400 text-white"
              />
            </div>
          )}
        </div>

        {/* Difficulty and Timer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Casual', 'Challenging', 'Mastermind'] as const).map((diff) => (
                <button
                  key={diff}
                  id={`diff-btn-${diff}`}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    difficulty === diff
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              Time Per Question
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Unlimited', value: 0 },
                { label: '20 Sec', value: 20 },
                { label: '15 Sec', value: 15 },
              ].map((t) => (
                <button
                  key={t.value}
                  id={`timer-btn-${t.value}`}
                  type="button"
                  onClick={() => setTimeLimit(t.value)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    timeLimit === t.value
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Search Grounding toggle */}
          <div
            onClick={() => setEnableSearchGrounding(!enableSearchGrounding)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
              enableSearchGrounding
                ? 'bg-cyan-950/30 border-cyan-500/50'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl mt-0.5 ${
                  enableSearchGrounding
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Search className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    Google Search Grounding
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-900 text-cyan-200">
                    Gemini 3.5 Flash
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Verifies real-world trivia with live web search sources and references.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableSearchGrounding}
              onChange={() => {}}
              className="mt-1 accent-cyan-400"
            />
          </div>

          {/* TTS Host Voice toggle */}
          <div
            onClick={() => setEnableTTS(!enableTTS)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
              enableTTS
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl mt-0.5 ${
                  enableTTS
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    AI Host Voice Commentary
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-900 text-amber-200">
                    Gemini 3.1 TTS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Speaks questions and delivers live reactions in {host.name}&apos;s voice.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableTTS}
              onChange={() => {}}
              className="mt-1 accent-amber-400"
            />
          </div>
        </div>

        {/* Start Game Action */}
        <div className="pt-4 flex justify-center">
          <button
            id="start-trivia-round-btn"
            type="button"
            onClick={handleLaunch}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Launch Trivia Showdown (5 Questions)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
