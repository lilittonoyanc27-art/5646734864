import React from 'react';
import { Question } from './types.ts';
import { Users, X } from 'lucide-react';

interface AudienceModalProps {
  question: Question;
  votes: Record<string, number>;
  onClose: () => void;
}

export const AudienceModal: React.FC<AudienceModalProps> = ({
  question,
  votes,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#05143d] border-2 border-cyan-400/50 rounded-2xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(0,140,255,0.3)] relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-300/70 hover:text-cyan-100 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-300 border border-cyan-400/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-300">
              Դահլիճի օգնություն (Votación del público)
            </h3>
            <p className="text-xs text-cyan-100/70">
              Դահլիճի 100 իսպանախոս մասնակիցներ քվեարկեցին տարբերակների օգտին.
            </p>
          </div>
        </div>

        {/* Bar chart representation */}
        <div className="space-y-3.5 my-6 bg-[#020a22]/80 p-4 rounded-xl border border-cyan-900/60">
          {(['A', 'B', 'C', 'D'] as const).map((key) => {
            const percentage = votes[key] || 0;
            const isCorrect = question.correctKey === key;
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-cyan-100">
                    <span className="w-5 h-5 rounded-full bg-[#081f59] text-amber-300 flex items-center justify-center text-[11px] border border-cyan-500/40">
                      {key}
                    </span>
                    <span className="truncate max-w-[240px] text-slate-200 font-normal">
                      {question.options.find(o => o.key === key)?.textEs}
                    </span>
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{percentage}%</span>
                </div>
                <div className="h-4 bg-[#0a1c47] rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isCorrect 
                        ? 'bg-gradient-to-r from-cyan-400 to-amber-300 shadow-[0_0_10px_rgba(0,212,255,0.5)]' 
                        : 'bg-blue-800'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center text-cyan-200/80 mb-4">
          Դահլիճի մեծամասնությունը հակված է տարբերակ <span className="font-bold text-amber-300">{question.correctKey}</span>-ին:
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
        >
          Շնորհակալություն, հասկացա
        </button>
      </div>
    </div>
  );
};
