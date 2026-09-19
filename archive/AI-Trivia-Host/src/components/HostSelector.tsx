import React from 'react';
import { Plus, Sparkles, Mic, Play, Radio, Volume2, Check } from 'lucide-react';
import { HostPersonality } from '../types';
import { HostAvatar } from './HostAvatar';

interface HostSelectorProps {
  hosts: HostPersonality[];
  selectedHostId: string;
  onSelectHost: (host: HostPersonality) => void;
  onOpenCustomHostModal: () => void;
  onPreviewVoice: (host: HostPersonality) => void;
  isLoadingVoice: boolean;
  playingVoiceHostId: string | null;
  onStartLiveVoiceDirect: (host: HostPersonality) => void;
}

export const HostSelector: React.FC<HostSelectorProps> = ({
  hosts,
  selectedHostId,
  onSelectHost,
  onOpenCustomHostModal,
  onPreviewVoice,
  isLoadingVoice,
  playingVoiceHostId,
  onStartLiveVoiceDirect,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Choose Your AI Master of Ceremonies
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Select Your Dynamic AI Host
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Every host features a distinct personality, custom banter style, voice synthesis powered by
          Gemini TTS, and real-time live microphone conversation via Gemini Live API.
        </p>
      </div>

      {/* Grid of hosts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hosts.map((host) => {
          const isSelected = host.id === selectedHostId;
          const isAudioPlaying = playingVoiceHostId === host.id;

          return (
            <div
              key={host.id}
              id={`host-card-${host.id}`}
              onClick={() => onSelectHost(host)}
              className={`relative rounded-3xl p-5 border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-400/80 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/50'
                  : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div>
                {/* Host Avatar & Header */}
                <div className="flex items-start gap-4">
                  <HostAvatar
                    host={host}
                    size="md"
                    isSpeaking={isAudioPlaying}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                      {host.badge}
                    </span>
                    <h3 className="font-bold text-white text-base mt-1 truncate">
                      {host.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {host.title}
                    </p>
                  </div>
                </div>

                {/* Catchphrase quote */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <p className="text-xs italic text-slate-300 font-serif leading-relaxed line-clamp-2">
                    &ldquo;{host.catchphrase}&rdquo;
                  </p>
                </div>

                {/* Bio */}
                <p className="mt-3 text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {host.bio}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  id={`preview-voice-btn-${host.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewVoice(host);
                  }}
                  disabled={isLoadingVoice && playingVoiceHostId === host.id}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isAudioPlaying
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Volume2
                    className={`w-3.5 h-3.5 ${
                      isAudioPlaying ? 'animate-bounce text-amber-400' : ''
                    }`}
                  />
                  <span>
                    {isAudioPlaying
                      ? 'Speaking...'
                      : `Voice: ${host.voiceName}`}
                  </span>
                </button>

                <button
                  id={`talk-live-btn-${host.id}`}
                  type="button"
                  title="Direct Voice Call (Live API)"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartLiveVoiceDirect(host);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Talk Live</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Custom Host Card creator */}
        <div
          id="create-custom-host-card"
          onClick={onOpenCustomHostModal}
          className="rounded-3xl p-6 border-2 border-dashed border-slate-700 hover:border-amber-400/60 bg-slate-900/40 hover:bg-slate-900/80 transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[260px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
            Create Custom AI Host
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
            Design your own persona, choose their voice, define witty reactions, and challenge your friends.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
            Build Personality &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
