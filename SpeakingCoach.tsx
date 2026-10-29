import React, { useState } from 'react';
import { Question } from './types.ts';
import { sounds } from './sound.ts';
import { Volume2, Sparkles, Check, ArrowRight, MessageSquareQuote } from 'lucide-react';

interface SpeakingCoachProps {
  question: Question;
  isCorrect: boolean;
  onProceed: () => void;
}

export const SpeakingCoach: React.FC<SpeakingCoachProps> = ({
  question,
  isCorrect,
  onProceed,
}) => {
  const [userSentence, setUserSentence] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Ready-to-use quick chips for constructing a sentence
  const quickWords = [
    'A mí me cuesta',
    'A ti te cuesta',
    'A mi amigo le cuesta',
    'A nosotros nos cuesta',
    'A ellos les cuesta',
    'Ayer me costó',
    'De pequeño me costaba',
    'Me costará',
    'Me costaría',
    'levantarme temprano',
    'hablar en público',
    'decir que no',
    'concentrarme',
    'hablar por teléfono',
    'cocinar',
    'aprender vocabulario nuevo',
  ];

  const handleAddChip = (word: string) => {
    setUserSentence((prev) => (prev ? `${prev} ${word}` : word));
  };

  const handleSpeak = () => {
    if (userSentence.trim()) {
      sounds.speakSpanish(userSentence);
    }
  };

  const handleVerify = () => {
    if (userSentence.trim().length > 3) {
      setFeedbackGiven(true);
      sounds.playCorrect();
    }
  };

  return (
    <div className="bg-[#05133b]/95 border-2 border-cyan-400/40 rounded-xl p-5 shadow-[0_4px_30px_rgba(0,30,80,0.5)] relative overflow-hidden backdrop-blur-md">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-900/50 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            <MessageSquareQuote className="w-5 h-5" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <span>Առաջադրանք բանավոր խոսքի համար</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-200 border border-cyan-500/40">
                Tarea de expresión oral
              </span>
            </h4>
            <p className="text-xs text-cyan-100/70">
              {isCorrect 
                ? 'Յուրաքանչյուր ճիշտ պատասխանից հետո կազմիր քո սեփական նախադասությունը՝ օգտագործելով նույն կառույցը:'
                : 'Ուսումնասիրիր ճիշտ կառույցը և կազմիր նախադասություն ամրապնդելու համար:'}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#020a22] border border-cyan-400/40 text-amber-300">
          Կառույց՝ {question.grammarPattern}
        </div>
      </div>

      {/* Model Examples */}
      <div className="mb-4 bg-[#030d2a]/80 border border-cyan-900/50 rounded-lg p-3 space-y-2">
        <div className="text-xs font-semibold text-cyan-200/80 flex items-center justify-between">
          <span>Օրինակելի նախադասություններ (Ejemplos):</span>
          <span className="text-[11px] text-amber-300">Սեղմիր 🔊 լսելու համար</span>
        </div>
        {question.sampleSpeakingSentences.map((sample, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-3 bg-[#061845] p-2.5 rounded border border-cyan-900/40 hover:border-cyan-500/40 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-amber-200">
                «{sample.es}»
              </p>
              <p className="text-xs text-cyan-100/70 mt-0.5">
                {sample.hy}
              </p>
            </div>
            <button
              onClick={() => sounds.speakSpanish(sample.es)}
              title="Լսել իսպաներեն արտասանությունը"
              className="p-1.5 rounded-md bg-[#0a2364] hover:bg-cyan-500/25 text-cyan-200 border border-cyan-500/30 transition-all shrink-0"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Builder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-cyan-100">
            Քո նախադասությունը (Իսպաներեն)՝
          </label>
          <span className="text-[11px] text-cyan-300/60">
            Կարող ես գրել կամ սեղմել բառ-բլոկները
          </span>
        </div>

        <div className="relative">
          <textarea
            value={userSentence}
            onChange={(e) => {
              setUserSentence(e.target.value);
              setFeedbackGiven(false);
            }}
            placeholder={`Օրինակ՝ ${question.sampleSpeakingSentences[0]?.es || 'Me cuesta...'}`}
            className="w-full bg-[#020b22] border border-cyan-500/40 rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 min-h-[75px]"
          />
          {userSentence && (
            <button
              onClick={handleSpeak}
              title="Լսել իմ գրած նախադասությունը"
              className="absolute right-3 bottom-3 p-1.5 rounded-md bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 border border-cyan-400/40 transition-all"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick helper chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-cyan-200/70">Արագ արտահայտություններ՝</span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 scrollbar-thin">
            {quickWords.map((word, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddChip(word)}
                className="text-[11px] px-2 py-1 bg-[#061845] hover:bg-[#0a2364] text-cyan-100 border border-cyan-900 hover:border-cyan-400/50 rounded transition-colors"
              >
                + {word}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback area */}
        {feedbackGiven && (
          <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-400/50 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Գերազանց է։ Փորձիր նախադասությունը բարձրաձայն արտասանել 2 անգամ՝ հիշողության մեջ ամրապնդելու համար։
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleVerify}
              disabled={!userSentence.trim()}
              className="px-3.5 py-2 rounded-lg bg-[#071d53] hover:bg-[#0b2b78] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-cyan-100 border border-cyan-500/40 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ամրապնդել & Լսել</span>
            </button>
            {userSentence.trim() && (
              <button
                onClick={handleSpeak}
                className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-semibold text-cyan-200 border border-cyan-400/40 transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Արտասանել</span>
              </button>
            )}
          </div>

          <button
            onClick={onProceed}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <span>Շարունակել խաղը</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
