export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface OptionItem {
  key: OptionKey;
  textEs: string;
  textHy: string;
}

export interface Question {
  id: number;
  part: 1 | 2 | 3;
  partTitleEs: string;
  partTitleHy: string;
  level: string;
  questionEs: string;
  questionHy: string;
  options: OptionItem[];
  correctKey: OptionKey;
  explanationHy: string;
  explanationEs?: string;
  grammarPattern: string;
  grammarTipHy: string;
  speakingPromptHy: string;
  sampleSpeakingSentences: Array<{
    es: string;
    hy: string;
  }>;
  reward: number; // e.g. 5,000 up to 1,000,000
}

export interface LifelineState {
  fiftyFifty: boolean; // available or used
  audience: boolean;
  phoneFriend: boolean;
  grammarHint: boolean;
}

export interface AudienceVote {
  A: number;
  B: number;
  C: number;
  D: number;
}
