import React from 'react';
import { Question } from './types.ts';
import { PhoneCall, X, UserCheck } from 'lucide-react';

interface FriendModalProps {
  question: Question;
  onClose: () => void;
}

export const FriendModal: React.FC<FriendModalProps> = ({ question, onClose }) => {
  const correctOption = question.options.find(o => o.key === question.correctKey);

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
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-300">
              Զանգ ընկերոջը (Llamada a un amigo)
            </h3>
            <p className="text-xs text-cyan-100/70">
              Կապ՝ Արամ (իսպաներենի դասախոս Բարսելոնայում)
            </p>
          </div>
        </div>

        <div className="my-5 p-4 rounded-xl bg-[#020a22]/85 border border-cyan-900/60 space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <UserCheck className="w-4 h-4 text-cyan-300" />
            <span className="font-semibold">Արամի պատասխանը.</span>
          </div>

          <p className="text-sm text-cyan-100 italic leading-relaxed">
            «Ողջո՛ւյն: Լսեցի հարցը: Այստեղ խոսքը գնում է <span className="text-amber-300 font-semibold">{question.grammarPattern}</span> կառույցի մասին: 
            Գրեթե 95% վստահ եմ, որ ճիշտ տարբերակն է <strong className="text-amber-400 font-bold">{question.correctKey}) {correctOption?.textEs}</strong>: 
            {question.grammarTipHy}»
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
        >
          Շնորհակալություն Արամին
        </button>
      </div>
    </div>
  );
};
