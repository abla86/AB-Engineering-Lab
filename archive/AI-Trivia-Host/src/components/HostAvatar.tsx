import React from 'react';
import {
  GraduationCap,
  Zap,
  Sparkles,
  Compass,
  Cpu,
  User,
  Volume2,
  Radio,
} from 'lucide-react';
import { HostPersonality } from '../types';

interface HostAvatarProps {
  host: HostPersonality;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDetails?: boolean;
  onPreviewVoice?: (host: HostPersonality) => void;
  isLoadingVoice?: boolean;
}

export const HostAvatar: React.FC<HostAvatarProps> = ({
  host,
  isSpeaking = false,
  size = 'md',
  showDetails = false,
  onPreviewVoice,
  isLoadingVoice = false,
}) => {
  const getIcon = (iconName: string) => {
    const props = { className: 'w-full h-full' };
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      default:
        return <User {...props} />;
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10 p-2 text-sm',
    md: 'w-16 h-16 p-3 text-base',
    lg: 'w-24 h-24 p-5 text-lg',
    xl: 'w-32 h-32 p-7 text-xl',
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        {/* Animated speaking audio waves */}
        {isSpeaking && (
          <div className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
        )}
        {isSpeaking && (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 opacity-70 blur-sm animate-pulse pointer-events-none" />
        )}

        {/* Avatar badge container */}
        <div
          id={`host-avatar-${host.id}`}
          className={`relative rounded-2xl bg-gradient-to-br ${host.accentGradient} text-white shadow-xl flex items-center justify-center transition-transform duration-300 ${
            isSpeaking ? 'scale-105 shadow-cyan-500/20 ring-4 ring-amber-400/60' : 'hover:scale-102 ring-1 ring-white/10'
          } ${sizeClasses[size]}`}
        >
          {getIcon(host.avatarIcon)}

          {/* Voice indicator badge */}
          {isSpeaking && (
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md animate-bounce">
              <Radio className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="font-bold text-slate-100 text-base leading-tight">
              {host.name}
            </h3>
            {onPreviewVoice && (
              <button
                id={`preview-voice-btn-${host.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewVoice(host);
                }}
                title="Preview voice"
                disabled={isLoadingVoice}
                className="p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isLoadingVoice ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-xs text-amber-400/90 font-medium tracking-wide">
            {host.title}
          </p>
          <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Voice: {host.voiceName}
          </span>
        </div>
      )}
    </div>
  );
};
