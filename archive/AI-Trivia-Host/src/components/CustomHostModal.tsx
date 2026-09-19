import React, { useState } from 'react';
import { X, Sparkles, Wand2, User, Mic } from 'lucide-react';
import { HostPersonality, VoiceName } from '../types';

interface CustomHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveHost: (host: HostPersonality) => void;
}

const TEMPLATES = [
  {
    name: 'Chef Pierre Tartine',
    title: 'The Gordon Ramsay of Trivia',
    voiceName: 'Fenrir' as VoiceName,
    catchphrase: 'RAW! That answer was completely uncooked!',
    systemPrompt: `You are Chef Pierre Tartine, a fiery, Michelin-starred culinary perfectionist hosting a trivia kitchen. You treat every question like a high-end gourmet dish.
When contestants answer correctly: "Magnifique! Perfectly seasoned intellect with notes of brilliance!"
When they miss: "Dreadful! Completely undercooked! Even my sous-chef knows better! Get back to the cutting board!"
Be loud, theatrical, culinary-obsessed, and hilarious.`,
  },
  {
    name: 'Lady Genevieve de Winter',
    title: 'The Noir Mystery Sleuth',
    voiceName: 'Kore' as VoiceName,
    catchphrase: 'The clues are laid bare in the shadows of truth.',
    systemPrompt: `You are Lady Genevieve de Winter, a 1940s noir private investigator and detective hosting a gritty trivia interrogation.
You speak in smoky metaphors, trench coats, rain-slicked city streets, and detective deductions.
When contestants answer correctly: "The fingerprint matches. You cracked the alibi wide open, kid."
When they miss: "A dead end in a dark alley. Somebody fed you a red herring, and you swallowed it whole."
Maintain cool, atmospheric 1940s noir suspense.`,
  },
  {
    name: 'Sir William Quill',
    title: 'The Elizabethan Bard',
    voiceName: 'Charon' as VoiceName,
    catchphrase: 'To know, or not to know: that is the trivia question!',
    systemPrompt: `You are Sir William Quill, an Elizabethan playwright and poet hosting a grand dramatic trivia performance.
You speak in dramatic iambic cadence, theatrical flourishes, rhyming couplets, and classic theatrical flair (e.g. "Hark!", "Alas!", "Thou art triumphant!").
When contestants answer correctly: "Bravissimo! Apollo himself crowns thy noble cranium with laurel wreaths!"
When they miss: "O tragedy! A heart-rending catastrophe upon the Globe stage! Weep, ye muses!"
Stay poetic, theatrical, and passionately dramatic.`,
  },
  {
    name: 'DJ Neon Pulse',
    title: 'Late Night Retro Synth Host',
    voiceName: 'Puck' as VoiceName,
    catchphrase: 'Broadcasting live across the frequencies of retro cyberspace!',
    systemPrompt: `You are DJ Neon Pulse, an ultra-smooth 80s late-night FM radio host broadcasting synthwave tunes and trivia riddles.
You speak with smooth cadence, cool lingo, funky groove, and radio drops (e.g. "Coming in hot on line 9", "That groove is in the pocket").
Keep the vibe cool, magnetic, rhythmic, and stylish.`,
  },
];

export const CustomHostModal: React.FC<CustomHostModalProps> = ({
  isOpen,
  onClose,
  onSaveHost,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [voiceName, setVoiceName] = useState<VoiceName>('Puck');
  const [catchphrase, setCatchphrase] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setName(tmpl.name);
    setTitle(tmpl.title);
    setVoiceName(tmpl.voiceName);
    setCatchphrase(tmpl.catchphrase);
    setSystemPrompt(tmpl.systemPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !systemPrompt.trim()) return;

    const newHost: HostPersonality = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      title: title.trim() || 'Custom Trivia Host',
      avatarIcon: 'Sparkles',
      badge: 'User Created Host',
      voiceName,
      bio: systemPrompt.slice(0, 140) + '...',
      catchphrase: catchphrase.trim() || 'Let the trivia begin!',
      systemPrompt: systemPrompt.trim(),
      accentGradient: 'from-amber-600 via-rose-600 to-indigo-900',
      themeColor: 'amber',
      isCustom: true,
    };

    onSaveHost(newHost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Create Your Dynamic AI Host
            </h2>
          </div>
          <button
            id="close-custom-host-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick templates */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Persona Inspirations (Click to load):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="text-left p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-amber-400/50 transition-all text-xs"
              >
                <div className="font-semibold text-amber-300 truncate">{tmpl.name}</div>
                <div className="text-slate-400 text-[10px] truncate">{tmpl.title}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Host Name *
              </label>
              <input
                id="custom-host-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sherlock Holmes, Gordon Ramsay, Master Yoda"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-amber-400 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Host Title / Tagline
              </label>
              <input
                id="custom-host-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Baker Street Sleuth"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-amber-400 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                Vocal Profile (Gemini TTS & Live Model)
              </label>
              <select
                id="custom-host-voice-select"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value as VoiceName)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-amber-400 text-white"
              >
                <option value="Puck">Puck (Energetic, high-spirited, clear)</option>
                <option value="Charon">Charon (Erudite, deep, distinguished)</option>
                <option value="Kore">Kore (Warm, intellectual, articulate)</option>
                <option value="Fenrir">Fenrir (Gruff, booming, spirited)</option>
                <option value="Zephyr">Zephyr (Cool, calculated, futuristic)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Signature Catchphrase
              </label>
              <input
                id="custom-host-catchphrase-input"
                type="text"
                value={catchphrase}
                onChange={(e) => setCatchphrase(e.target.value)}
                placeholder="e.g., Elementary, my dear contestant!"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-amber-400 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Personality & Prompt Instructions *
            </label>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Explain how your host behaves, how they banter, how they react when the player answers correctly vs. incorrectly, and any quirks.
            </p>
            <textarea
              id="custom-host-prompt-textarea"
              required
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are [Name], a [adjectives] trivia host. You speak like... When players win, you... When players lose, you..."
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-amber-400 text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              id="cancel-custom-host-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-custom-host-btn"
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Save & Select Host
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
