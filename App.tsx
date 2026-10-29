import { useState, useMemo } from 'react';
import { QUESTIONS } from './questions.ts';
import { OptionKey } from './types.ts';
import { sounds } from './sound.ts';
import { MoneyLadder } from './MoneyLadder.tsx';
import { SpeakingCoach } from './SpeakingCoach.tsx';
import { AudienceModal } from './AudienceModal.tsx';
import { FriendModal } from './FriendModal.tsx';
import { GrammarGuideModal } from './GrammarGuideModal.tsx';
import {
  Volume2,
  VolumeX,
  Users,
  PhoneCall,
  BookOpen,
  Sparkles,
  RotateCcw,
  Menu,
  ChevronRight,
  Eye,
  EyeOff,
  Trophy,
  CheckCircle,
  XCircle,
  Lightbulb,
} from 'lucide-react';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<OptionKey | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [revealedResult, setRevealedResult] = useState(false);
  const [showSpeakingCoach, setShowSpeakingCoach] = useState(false);

  // Translation visibility states (User requested: click on Spanish text opens Armenian translation, questions and answers separately!)
  const [showQuestionTranslation, setShowQuestionTranslation] = useState(false);
  const [revealedOptionTranslations, setRevealedOptionTranslations] = useState<Record<string, boolean>>({});

  // History of answers: { [questionId]: { selected, isCorrect } }
  const [answersHistory, setAnswersHistory] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});

  // Lifelines state
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    audience: true,
    phoneFriend: true,
    grammarGuide: true,
  });

  // Active hidden options from 50:50 for current question
  const [hiddenOptions, setHiddenOptions] = useState<OptionKey[]>([]);

  // Modals
  const [isLadderOpen, setIsLadderOpen] = useState(false);
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false);
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [audienceVotes, setAudienceVotes] = useState<Record<string, number>>({});

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Victory / Game finished modal
  const [gameFinished, setGameFinished] = useState(false);

  const currentQ = QUESTIONS[currentIndex];

  // Calculate accumulated score
  const totalCorrect = useMemo(() => {
    return Object.values(answersHistory).filter((h) => h.isCorrect).length;
  }, [answersHistory]);

  const currentMoneyWon = useMemo(() => {
    let money = 0;
    Object.entries(answersHistory).forEach(([qId, val]) => {
      if (val.isCorrect) {
        const q = QUESTIONS.find((item) => item.id === Number(qId));
        if (q) money += q.reward;
      }
    });
    return money;
  }, [answersHistory]);

  // Toggle audio
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  // Lifeline: 50:50
  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || isLocked) return;
    sounds.playLifeline();
    const wrongOptions = currentQ.options
      .filter((opt) => opt.key !== currentQ.correctKey)
      .map((opt) => opt.key);

    const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
    const toRemove = shuffledWrong.slice(0, 2);

    setHiddenOptions(toRemove);
    setLifelines((prev) => ({ ...prev, fiftyFifty: false }));
  };

  // Lifeline: Audience
  const useAudience = () => {
    if (!lifelines.audience || isLocked) return;
    sounds.playLifeline();
    const correct = currentQ.correctKey;
    const correctShare = 68 + Math.floor(Math.random() * 18);
    const remainder = 100 - correctShare;

    const wrongKeys = (['A', 'B', 'C', 'D'] as OptionKey[]).filter((k) => k !== correct);
    const split1 = Math.floor(Math.random() * (remainder - 4));
    const split2 = Math.floor(Math.random() * (remainder - split1 - 2));
    const split3 = remainder - split1 - split2;

    const votes: Record<string, number> = {
      [correct]: correctShare,
      [wrongKeys[0]]: split1,
      [wrongKeys[1]]: split2,
      [wrongKeys[2]]: split3,
    };

    setAudienceVotes(votes);
    setIsAudienceModalOpen(true);
    setLifelines((prev) => ({ ...prev, audience: false }));
  };

  // Lifeline: Phone a Friend
  const useFriend = () => {
    if (!lifelines.phoneFriend || isLocked) return;
    sounds.playLifeline();
    setIsFriendModalOpen(true);
    setLifelines((prev) => ({ ...prev, phoneFriend: false }));
  };

  // Lifeline: Grammar Guide
  const useGrammarGuide = () => {
    sounds.playLifeline();
    setIsGrammarModalOpen(true);
  };

  // Selecting an option
  const handleSelectOption = (key: OptionKey) => {
    if (isLocked) return;
    setSelectedKey(key);
    setIsLocked(true);
    sounds.playSuspense();

    // Dramatic delay (650ms) for millionaire suspense
    setTimeout(() => {
      const isCorrect = key === currentQ.correctKey;
      if (isCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
      }

      setRevealedResult(true);
      setShowSpeakingCoach(true);

      // Record history
      setAnswersHistory((prev) => ({
        ...prev,
        [currentQ.id]: {
          selected: key,
          isCorrect,
        },
      }));

      // Automatically reveal translations on answer to learn
      setShowQuestionTranslation(true);
      setRevealedOptionTranslations((prev) => ({
        ...prev,
        [key]: true,
        [currentQ.correctKey]: true,
      }));
    }, 650);
  };

  // Proceed to next question (user requirement: continue playing even if wrong!)
  const handleProceedNext = () => {
    setShowSpeakingCoach(false);
    setSelectedKey(null);
    setIsLocked(false);
    setRevealedResult(false);
    setShowQuestionTranslation(false);
    setRevealedOptionTranslations({});
    setHiddenOptions([]);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameFinished(true);
      sounds.playMillionWin();
    }
  };

  // Jump to specific question directly
  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setSelectedKey(null);
    setIsLocked(false);
    setRevealedResult(false);
    setShowSpeakingCoach(false);
    setShowQuestionTranslation(false);
    setRevealedOptionTranslations({});
    setHiddenOptions([]);
  };

  // Toggle individual option translation
  const toggleOptionTranslation = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedOptionTranslations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle question translation
  const toggleQuestionTranslation = () => {
    setShowQuestionTranslation((prev) => !prev);
  };

  // Reveal all translations for current question
  const toggleAllTranslations = () => {
    const nextState = !showQuestionTranslation;
    setShowQuestionTranslation(nextState);
    const newOpts: Record<string, boolean> = {};
    currentQ.options.forEach((opt) => {
      newOpts[opt.key] = nextState;
    });
    setRevealedOptionTranslations(newOpts);
  };

  // Reset entire game
  const handleResetGame = () => {
    if (window.confirm('Վերսկսե՞լ խաղը սկզբից:')) {
      setCurrentIndex(0);
      setSelectedKey(null);
      setIsLocked(false);
      setRevealedResult(false);
      setShowSpeakingCoach(false);
      setShowQuestionTranslation(false);
      setRevealedOptionTranslations({});
      setHiddenOptions([]);
      setAnswersHistory({});
      setLifelines({
        fiftyFifty: true,
        audience: true,
        phoneFriend: true,
        grammarGuide: true,
      });
      setGameFinished(false);
    }
  };

  return (
    <div className="millionaire-bg relative overflow-x-hidden min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Studio Stage Atmospheric Lighting */}
      <div className="stage-beam-left" />
      <div className="stage-beam-right" />
      <div className="studio-arena-ring" />

      {/* Top Navigation Bar in deep sapphire navy */}
      <header className="border-b border-cyan-500/25 bg-[#030d29]/90 backdrop-blur-md sticky top-0 z-30 px-4 py-2.5 shadow-[0_4px_20px_rgba(0,20,60,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-400 to-amber-300 p-0.5 shadow-md shadow-cyan-500/25">
              <div className="w-full h-full bg-[#030d29] rounded-[10px] flex items-center justify-center font-serif font-black text-amber-400 text-base">
                ֏
              </div>
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-amber-200 tracking-wide flex items-center gap-2">
                <span>Ո՞վ է ուզում դառնալ միլիոնատեր</span>
                <span className="hidden sm:inline-block text-[11px] font-normal px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  Me cuesta + infinitivo
                </span>
              </h1>
              <p className="text-[11px] text-cyan-200/70">
                Իսպաներեն A2–B1 • 30 զվարճալի հարցեր հայերեն թարգմանություններով
              </p>
            </div>
          </div>

          {/* Top Actions: Part Selector, Sound, Reset, Score */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Part Filter Buttons */}
            <div className="hidden md:flex items-center bg-[#05143d]/90 rounded-lg p-0.5 border border-cyan-500/30 text-xs">
              <button
                onClick={() => handleJumpToQuestion(0)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentQ.part === 1 ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-cyan-200'
                }`}
              >
                Մաս 1 (1–10)
              </button>
              <button
                onClick={() => handleJumpToQuestion(10)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentQ.part === 2 ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-cyan-200'
                }`}
              >
                Մաս 2 (11–20)
              </button>
              <button
                onClick={() => handleJumpToQuestion(20)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentQ.part === 3 ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-cyan-200'
                }`}
              >
                Մաս 3 (21–30)
              </button>
            </div>

            {/* Total prize won */}
            <div className="bg-[#051540]/90 border border-amber-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-amber-500/10">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-300">
                {currentMoneyWon.toLocaleString('hy-AM')} ֏
              </span>
            </div>

            {/* Grammar cheat sheet */}
            <button
              onClick={useGrammarGuide}
              title="Քերականական կանոններ"
              className="p-2 rounded-lg bg-[#05143d] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Անջատել ձայնը' : 'Միացնել ձայնը'}
              className="p-2 rounded-lg bg-[#05143d] border border-cyan-500/40 text-slate-300 hover:text-cyan-300 hover:bg-[#081e59] transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Reset */}
            <button
              onClick={handleResetGame}
              title="Վերսկսել խաղը"
              className="p-2 rounded-lg bg-[#05143d] border border-cyan-500/40 text-slate-400 hover:text-rose-400 hover:bg-[#081e59] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Ladder toggle button (mobile) */}
            <button
              onClick={() => setIsLadderOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full relative z-10">
        {/* Game Stage (Center) */}
        <main className="flex-1 p-3 sm:p-6 flex flex-col justify-between max-w-4xl mx-auto w-full overflow-y-auto">
          {/* Top Bar: Lifelines & Question Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#041135]/85 p-3 rounded-xl border border-cyan-500/30 backdrop-blur-md shadow-md">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-gradient-to-r from-blue-600/40 to-cyan-500/30 text-cyan-200 text-xs font-bold border border-cyan-400/40">
                  ՀԱՐՑ {currentQ.id} / 30
                </span>
                <span className="text-xs text-cyan-100/70 font-medium">
                  {currentQ.partTitleHy}
                </span>
              </div>

              {/* Lifeline Buttons with authentic circular TV glow */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-cyan-300/80 hidden sm:inline">
                  Օգնություններ՝
                </span>

                {/* 50:50 */}
                <button
                  onClick={useFiftyFifty}
                  disabled={!lifelines.fiftyFifty || isLocked}
                  title="50:50 (Հեռացնել 2 սխալ տարբերակ)"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                    lifelines.fiftyFifty && !isLocked
                      ? 'bg-[#061b4d] hover:bg-cyan-500/25 border-cyan-400/50 text-cyan-200 hover:scale-105 shadow-[0_0_12px_rgba(0,180,255,0.2)]'
                      : 'bg-[#030b20]/60 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                  }`}
                >
                  50:50
                </button>

                {/* Audience */}
                <button
                  onClick={useAudience}
                  disabled={!lifelines.audience || isLocked}
                  title="Հարցում դահլիճին (Audience vote)"
                  className={`p-1.5 rounded-lg transition-all border ${
                    lifelines.audience && !isLocked
                      ? 'bg-[#061b4d] hover:bg-cyan-500/25 border-cyan-400/50 text-cyan-200 hover:scale-105 shadow-[0_0_12px_rgba(0,180,255,0.2)]'
                      : 'bg-[#030b20]/60 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </button>

                {/* Call Friend */}
                <button
                  onClick={useFriend}
                  disabled={!lifelines.phoneFriend || isLocked}
                  title="Զանգ ընկերոջը (Call a friend)"
                  className={`p-1.5 rounded-lg transition-all border ${
                    lifelines.phoneFriend && !isLocked
                      ? 'bg-[#061b4d] hover:bg-cyan-500/25 border-cyan-400/50 text-cyan-200 hover:scale-105 shadow-[0_0_12px_rgba(0,180,255,0.2)]'
                      : 'bg-[#030b20]/60 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                  }`}
                >
                  <PhoneCall className="w-4 h-4" />
                </button>

                {/* Quick Hint */}
                <button
                  onClick={useGrammarGuide}
                  title="Քերականական հուշում"
                  className="p-1.5 rounded-lg bg-[#061b4d] hover:bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 hover:scale-105 shadow-[0_0_12px_rgba(0,180,255,0.2)] transition-all"
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Translation Toolbar Notification */}
            <div className="flex items-center justify-between text-xs text-cyan-200/80 px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  💡 <strong>Խորհուրդ.</strong> Սեղմիր իսպաներեն հարցին կամ տարբերակներին՝ հայերեն թարգմանությունը բացելու համար:
                </span>
              </div>
              <button
                onClick={toggleAllTranslations}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer shrink-0 ml-2"
              >
                {showQuestionTranslation ? 'Թաքցնել թարգմանությունները' : 'Բացել բոլորը'}
              </button>
            </div>

            {/* The Question Box (Iconic Millionaire deep-blue hexagon spotlight box) */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30 rounded-2xl blur-xs opacity-80 group-hover:opacity-100 transition duration-300" />

              <div
                onClick={toggleQuestionTranslation}
                className="relative bg-gradient-to-b from-[#071946] to-[#041031] border-2 border-cyan-400/60 hover:border-cyan-300 rounded-2xl p-5 md:p-6 shadow-[0_0_35px_rgba(0,140,255,0.25)] transition-all cursor-pointer select-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    {/* Spanish Question (Clickable to reveal Armenian) */}
                    <div className="flex items-start gap-2">
                      <p className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
                        {currentQ.questionEs}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.speakSpanish(currentQ.questionEs);
                        }}
                        title="Լսել իսպաներեն արտասանությունը"
                        className="p-1.5 rounded-lg bg-[#0c2666] hover:bg-cyan-500/30 text-cyan-200 hover:text-cyan-100 border border-cyan-400/40 transition-colors shrink-0 mt-0.5"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Armenian Translation (Separately revealable upon click) */}
                    {showQuestionTranslation ? (
                      <div className="pt-2 border-t border-cyan-900/60 flex items-start gap-2 text-cyan-100/90 text-sm md:text-base animate-fadeIn">
                        <span className="font-semibold text-amber-300 text-xs px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 shrink-0">
                          Հայերեն
                        </span>
                        <p>{currentQ.questionHy}</p>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-cyan-900/40 flex items-center gap-1.5 text-xs text-cyan-300/80">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Սեղմիր այստեղ՝ հայերեն թարգմանությունը կարդալու համար</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-cyan-300/80 block">Մրցանակ</span>
                    <span className="text-base md:text-lg font-mono font-extrabold text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
                      {currentQ.reward.toLocaleString('hy-AM')} ֏
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Options Grid (4 Options A, B, C, D) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {currentQ.options.map((opt) => {
                const isHidden = hiddenOptions.includes(opt.key);
                if (isHidden) {
                  return (
                    <div
                      key={opt.key}
                      className="h-20 rounded-xl border border-blue-950/40 bg-[#020718]/40 opacity-15 pointer-events-none"
                    />
                  );
                }

                const isSelected = selectedKey === opt.key;
                const isCorrect = opt.key === currentQ.correctKey;
                const isTranslationRevealed = !!revealedOptionTranslations[opt.key];

                let optionStateStyles = 'bg-gradient-to-b from-[#081f57] to-[#041235] border-blue-500/40 text-slate-100 hover:border-cyan-300 hover:from-[#0a276e] hover:to-[#061846] shadow-[0_4px_16px_rgba(0,30,90,0.3)]';
                let keyBadgeStyles = 'bg-[#0d2a75] text-amber-300 border-cyan-500/40';

                if (isLocked && !revealedResult && isSelected) {
                  // Suspense amber state
                  optionStateStyles = 'bg-amber-600/35 border-amber-400 text-amber-200 animate-pulse ring-2 ring-amber-400/40';
                  keyBadgeStyles = 'bg-amber-500 text-slate-950 font-bold border-amber-300';
                } else if (revealedResult) {
                  if (isCorrect) {
                    optionStateStyles = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.35)]';
                    keyBadgeStyles = 'bg-emerald-500 text-slate-950 font-bold border-emerald-300';
                  } else if (isSelected && !isCorrect) {
                    optionStateStyles = 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
                    keyBadgeStyles = 'bg-rose-500 text-slate-100 font-bold border-rose-400';
                  } else {
                    optionStateStyles = 'bg-[#02091d]/60 border-blue-950 text-slate-500 opacity-60';
                  }
                }

                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`relative rounded-xl border-2 p-3.5 transition-all text-left flex flex-col justify-between gap-2 cursor-pointer ${optionStateStyles} ${
                      isLocked ? 'cursor-default' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs border shrink-0 transition-colors ${keyBadgeStyles}`}
                        >
                          {opt.key}
                        </span>
                        <div>
                          <p className="text-sm md:text-base font-semibold leading-snug">
                            {opt.textEs}
                          </p>
                        </div>
                      </div>

                      {/* TTS Voice for option */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.speakSpanish(opt.textEs);
                        }}
                        title="Լսել արտասանությունը"
                        className="p-1 rounded text-cyan-300/70 hover:text-cyan-200 hover:bg-cyan-500/20 transition-colors shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Armenian Translation Reveal for each Option individually */}
                    <div
                      onClick={(e) => toggleOptionTranslation(opt.key, e)}
                      className="border-t border-cyan-900/40 pt-2 flex items-center justify-between gap-2 text-xs hover:text-cyan-200 transition-colors"
                    >
                      {isTranslationRevealed ? (
                        <p className="text-amber-200/90 text-xs italic font-medium leading-tight">
                          🇦🇲 {opt.textHy}
                        </p>
                      ) : (
                        <span className="text-[11px] text-cyan-300/70 hover:text-cyan-200 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>Սեղմիր թարգմանությունը տեսնելու համար</span>
                        </span>
                      )}

                      <span className="text-[10px] text-cyan-400/80 shrink-0">
                        {isTranslationRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Answer Result Banner & Explanation */}
            {revealedResult && (
              <div
                className={`p-4 rounded-xl border animate-fadeIn transition-all shadow-lg ${
                  selectedKey === currentQ.correctKey
                    ? 'bg-emerald-950/70 border-emerald-400/60 text-emerald-200'
                    : 'bg-rose-950/70 border-rose-500/60 text-rose-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {selectedKey === currentQ.correctKey ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <h4 className="font-bold text-emerald-300 text-sm">
                            Ճիշտ պատասխան է։ (+{currentQ.reward.toLocaleString('hy-AM')} ֏)
                          </h4>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-400" />
                          <h4 className="font-bold text-rose-300 text-sm">
                            Սխալ պատասխան, բայց խաղը շարունակվում է։
                          </h4>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {currentQ.explanationHy}
                    </p>
                  </div>

                  <button
                    onClick={handleProceedNext}
                    className="self-end sm:self-center px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20"
                  >
                    <span>{currentIndex < QUESTIONS.length - 1 ? 'Հաջորդ հարցը' : 'Ավարտել'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Oral Speaking Practice Card (Requirement from Prompt) */}
            {showSpeakingCoach && (
              <div className="pt-2">
                <SpeakingCoach
                  question={currentQ}
                  isCorrect={selectedKey === currentQ.correctKey}
                  onProceed={handleProceedNext}
                />
              </div>
            )}
          </div>

          {/* Footer info & Progress bar */}
          <footer className="mt-8 pt-4 border-t border-cyan-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-cyan-200/70">
            <div className="flex items-center gap-2">
              <span className="font-mono">
                Ճիշտ՝ <strong className="text-emerald-400">{totalCorrect}</strong> / {QUESTIONS.length}
              </span>
              <span>•</span>
              <span className="font-mono">
                Հավաքած գումար՝ <strong className="text-amber-400">{currentMoneyWon.toLocaleString('hy-AM')} ֏</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleJumpToQuestion(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="px-2.5 py-1 rounded bg-[#061845] border border-cyan-500/40 hover:bg-[#0a2364] disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors text-cyan-200"
              >
                ◀ Նախորդը
              </button>
              <button
                onClick={() => handleJumpToQuestion(Math.min(QUESTIONS.length - 1, currentIndex + 1))}
                disabled={currentIndex === QUESTIONS.length - 1}
                className="px-2.5 py-1 rounded bg-[#061845] border border-cyan-500/40 hover:bg-[#0a2364] disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors text-cyan-200"
              >
                Հաջորդը ▶
              </button>
            </div>
          </footer>
        </main>

        {/* Money Ladder Sidebar (Desktop & Mobile Drawer) */}
        <MoneyLadder
          questions={QUESTIONS}
          currentIndex={currentIndex}
          answersHistory={answersHistory}
          isOpen={isLadderOpen}
          onClose={() => setIsLadderOpen(false)}
          onJumpToQuestion={handleJumpToQuestion}
        />
      </div>

      {/* Lifeline Modals */}
      {isAudienceModalOpen && (
        <AudienceModal
          question={currentQ}
          votes={audienceVotes}
          onClose={() => setIsAudienceModalOpen(false)}
        />
      )}

      {isFriendModalOpen && (
        <FriendModal
          question={currentQ}
          onClose={() => setIsFriendModalOpen(false)}
        />
      )}

      {isGrammarModalOpen && (
        <GrammarGuideModal
          currentRule={currentQ.grammarTipHy}
          onClose={() => setIsGrammarModalOpen(false)}
        />
      )}

      {/* Game Finished / Millionaire Winner Modal */}
      {gameFinished && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#051336] border-2 border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-5 shadow-[0_0_50px_rgba(0,180,255,0.3)] relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-1 flex items-center justify-center shadow-lg shadow-amber-500/40">
              <Trophy className="w-9 h-9 text-slate-950" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                Շնորհավորում ենք։
              </h2>
              <p className="text-slate-200 text-sm">
                Դուք անցաք «Me cuesta + infinitivo» խաղի բոլոր 30 հարցերը։
              </p>
            </div>

            <div className="bg-[#030b20]/90 border border-cyan-500/40 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-sm border-b border-cyan-900/40 pb-2">
                <span className="text-slate-300">Ճիշտ պատասխաններ՝</span>
                <span className="font-bold text-emerald-400 text-base">{totalCorrect} / 30</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Վաստակած մրցանակ՝</span>
                <span className="font-mono font-black text-amber-400 text-lg drop-shadow">
                  {currentMoneyWon.toLocaleString('hy-AM')} ֏
                </span>
              </div>
            </div>

            <p className="text-xs text-cyan-200/80 italic">
              «¡Enhorabuena! Has dominado las expresiones de dificultad en español».
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setGameFinished(false);
                  setCurrentIndex(0);
                }}
                className="flex-1 py-3 rounded-xl bg-[#081e59] hover:bg-[#0c2a7a] text-cyan-100 font-bold text-xs uppercase tracking-wider transition-colors border border-cyan-500/30"
              >
                Վերանայել հարցերը
              </button>
              <button
                onClick={handleResetGame}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/30"
              >
                Խաղալ նորից
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
