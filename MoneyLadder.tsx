import React from 'react';
import { Question } from './types.ts';
import { Award, ChevronRight, X } from 'lucide-react';

interface MoneyLadderProps {
  questions: Question[];
  currentIndex: number;
  answersHistory: Record<number, { selected: string; isCorrect: boolean }>;
  isOpen: boolean;
  onClose: () => void;
  onJumpToQuestion: (index: number) => void;
}

export const MoneyLadder: React.FC<MoneyLadderProps> = ({
  questions,
  currentIndex,
  answersHistory,
  isOpen,
  onClose,
  onJumpToQuestion,
}) => {
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('hy-AM') + ' ֏';
  };

  // Safe checkpoints
  const milestones = [5, 10, 15, 20, 25, 30];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 right-0 h-full w-80 max-w-[85vw] bg-[#030d29]/95 lg:bg-[#030e2c]/90 border-l border-cyan-500/30 backdrop-blur-md z-40 transition-transform duration-300 flex flex-col shadow-[0_0_30px_rgba(0,30,80,0.6)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-cyan-500/25 flex items-center justify-between bg-[#041238]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-amber-300 text-sm tracking-wide uppercase drop-shadow">
              Մրցանակային սանդուղք
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-cyan-300/70 hover:text-cyan-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level stats */}
        <div className="px-4 py-2 bg-[#02091d]/80 border-b border-cyan-900/40 text-xs flex justify-between text-cyan-200/70">
          <span>Հարց {currentIndex + 1} / {questions.length}</span>
          <span className="text-amber-300 font-bold">
            1,000,000 ֏
          </span>
        </div>

        {/* Ladder steps (reversed so 1,000,000 is on top) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-blue-800">
          {[...questions].reverse().map((q) => {
            const actualIndex = q.id - 1;
            const isCurrent = actualIndex === currentIndex;
            const history = answersHistory[q.id];
            const isAnswered = !!history;
            const isMilestone = milestones.includes(q.id);

            let statusBg = 'bg-[#04133a]/60 text-cyan-100/70 hover:bg-[#071f5c]';
            let borderStyle = 'border-blue-900/50';

            if (isCurrent) {
              statusBg = 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-[1.02] ring-2 ring-amber-300';
              borderStyle = 'border-amber-400';
            } else if (isAnswered) {
              if (history.isCorrect) {
                statusBg = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
              } else {
                statusBg = 'bg-rose-950/60 text-rose-300 border-rose-500/40';
              }
            } else if (isMilestone) {
              statusBg = 'bg-blue-950/70 text-amber-300 font-semibold border-amber-500/40';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  onJumpToQuestion(actualIndex);
                  onClose();
                }}
                className={`w-full py-1.5 px-3 rounded-md text-xs flex items-center justify-between border transition-all text-left ${statusBg} ${borderStyle}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 text-right font-mono text-[11px] ${isCurrent ? 'text-slate-950 font-black' : 'text-cyan-400/60'}`}>
                    {q.id}
                  </span>
                  <span className={`truncate max-w-[110px] text-[11px] ${isCurrent ? 'text-slate-950 font-bold' : ''}`}>
                    {q.id <= 10 ? 'Part 1' : q.id <= 20 ? 'Part 2' : 'Part 3'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-right text-[11px] ${isCurrent ? 'text-slate-950 font-black' : isMilestone ? 'text-amber-300 font-bold' : ''}`}>
                    {formatMoney(q.reward)}
                  </span>
                  {isAnswered && (
                    <span className="text-[10px]">
                      {history.isCorrect ? '✅' : '❌'}
                    </span>
                  )}
                  {isCurrent && <ChevronRight className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Milestone info */}
        <div className="p-3 bg-[#02091d]/90 border-t border-cyan-900/40 text-[11px] text-cyan-200/80">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              Անձեռնմխելի հանգրվաններ՝
            </span>
            <span className="font-mono text-amber-200 font-bold">
              5, 10, 15, 20, 25, 30
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
