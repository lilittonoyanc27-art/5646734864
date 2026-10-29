import React from 'react';
import { BookOpen, X, CheckCircle2 } from 'lucide-react';

interface GrammarGuideModalProps {
  currentRule?: string;
  onClose: () => void;
}

export const GrammarGuideModal: React.FC<GrammarGuideModalProps> = ({
  currentRule,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#05143d] border-2 border-cyan-400/50 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-[0_0_40px_rgba(0,140,255,0.35)] relative text-slate-100">
        <div className="p-5 border-b border-cyan-900/50 flex items-center justify-between bg-[#041033]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-300">
                Քերականական ուղեցույց — «Me cuesta...»
              </h3>
              <p className="text-xs text-cyan-100/70">
                A2–B1 Մակարդակ՝ իսպաներենի դժվարություն արտահայտող կառույցներ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-300/70 hover:text-cyan-100 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed scrollbar-thin">
          {currentRule && (
            <div className="p-3 bg-[#081e59]/80 border border-cyan-400/40 rounded-xl shadow-sm">
              <span className="font-bold text-amber-300 block mb-1">
                Այս հարցի քերականական կիզակետը՝
              </span>
              <p className="text-cyan-100">{currentRule}</p>
            </div>
          )}

          {/* Table of Pronouns */}
          <div className="bg-[#020b22]/90 p-3.5 rounded-xl border border-cyan-900/60">
            <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              1. Դերանուններ ըստ անձանց (Pronombres de Objeto Indirecto)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#061845] p-2 rounded border border-cyan-900/50">
                <span className="text-amber-300 font-semibold block">(A mí) me cuesta</span>
                <span className="text-cyan-200/70">Ինձ համար դժվար է</span>
              </div>
              <div className="bg-[#061845] p-2 rounded border border-cyan-900/50">
                <span className="text-amber-300 font-semibold block">(A nosotros) nos cuesta</span>
                <span className="text-cyan-200/70">Մեզ համար դժվար է</span>
              </div>
              <div className="bg-[#061845] p-2 rounded border border-cyan-900/50">
                <span className="text-amber-300 font-semibold block">(A ti) te cuesta</span>
                <span className="text-cyan-200/70">Քեզ համար դժվար է</span>
              </div>
              <div className="bg-[#061845] p-2 rounded border border-cyan-900/50">
                <span className="text-amber-300 font-semibold block">(A vosotros) os cuesta</span>
                <span className="text-cyan-200/70">Ձեզ համար դժվար է</span>
              </div>
              <div className="bg-[#061845] p-2 rounded border border-cyan-900/50">
                <span className="text-amber-300 font-semibold block">(A él / ella) le cuesta</span>
                <span className="text-cyan-200/70">Նրա համար դժվար է</span>
              </div>
              <div className="bg-[#061845] p-2 rounded border border-cyan-900/50">
                <span className="text-amber-300 font-semibold block">(A ellos / ellas) les cuesta</span>
                <span className="text-cyan-200/70">Նրանց համար դժվար է</span>
              </div>
            </div>
          </div>

          {/* Cuesta vs Cuestan */}
          <div className="bg-[#020b22]/90 p-3.5 rounded-xl border border-cyan-900/60">
            <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              2. Ե՞րբ օգտագործել Cuesta, իսկ ե՞րբ՝ Cuestan:
            </h4>
            <ul className="space-y-1.5 text-cyan-100 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Cuesta + Infinitivo (Անորոշ դերբայ):</strong> Me cuesta <em className="text-amber-300">levantarme</em> temprano.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Cuesta + Եզակի գոյական:</strong> Me cuesta <em className="text-amber-300">la gramática</em>.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Cuestan + Հոգնակի գոյական:</strong> Me cuestan <em className="text-amber-300">los verbos irregulares</em> (վարժություն 14):
                </span>
              </li>
            </ul>
          </div>

          {/* Tenses */}
          <div className="bg-[#020b22]/90 p-3.5 rounded-xl border border-cyan-900/60">
            <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              3. Ժամանակաձևերը (Los tiempos verbales)
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between border-b border-cyan-900/40 pb-1">
                <strong className="text-amber-300">Me cuesta (Ներկա)</strong>
                <span className="text-cyan-200/70">Ինձ համար դժվար է</span>
              </div>
              <div className="flex justify-between border-b border-cyan-900/40 pb-1">
                <strong className="text-amber-300">Me costaba (Imperfecto)</strong>
                <span className="text-cyan-200/70">Ինձ համար դժվար էր (մանկության տարիներին, կրկնվող)</span>
              </div>
              <div className="flex justify-between border-b border-cyan-900/40 pb-1">
                <strong className="text-amber-300">Me costó (Indefinido)</strong>
                <span className="text-cyan-200/70">Ինձ համար դժվար եղավ (երեկ, կոնկրետ ավարտված պահին)</span>
              </div>
              <div className="flex justify-between border-b border-cyan-900/40 pb-1">
                <strong className="text-amber-300">Me costará (Futuro)</strong>
                <span className="text-cyan-200/70">Ինձ համար դժվար կլինի (ապագայում)</span>
              </div>
              <div className="flex justify-between">
                <strong className="text-amber-300">Me costaría (Condicional)</strong>
                <span className="text-cyan-200/70">Ինձ համար դժվար կլիներ (եթե...)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-cyan-900/40 bg-[#030c27]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            Փակել
          </button>
        </div>
      </div>
    </div>
  );
};
