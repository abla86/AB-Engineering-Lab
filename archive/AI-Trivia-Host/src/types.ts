export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';

export interface HostPersonality {
  id: string;
  name: string;
  title: string;
  avatarIcon: string;
  badge: string;
  voiceName: VoiceName;
  bio: string;
  catchphrase: string;
  systemPrompt: string;
  accentGradient: string;
  themeColor: string;
  isCustom?: boolean;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TriviaQuestion {
  id: string;
  category: string;
  difficulty: 'Casual' | 'Challenging' | 'Mastermind';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hostIntroComment: string;
  groundingSources?: GroundingSource[];
}

export interface PlayerAnswerRecord {
  questionId: string;
  question: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  pointsEarned: number;
  hostReaction?: string;
}

export interface GameSettings {
  hostId: string;
  category: string;
  customTopic?: string;
  difficulty: 'Casual' | 'Challenging' | 'Mastermind';
  questionCount: number;
  enableTTS: boolean;
  enableSearchGrounding: boolean;
  timePerQuestion: number; // 0 for unlimited, or 15, 20, 30
}

export type GameStage = 
  | 'select_host'
  | 'select_settings'
  | 'loading_round'
  | 'question_active'
  | 'question_feedback'
  | 'game_over'
  | 'live_voice_room';
