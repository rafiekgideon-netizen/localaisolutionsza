import { useState } from "react";
import { 
  ArrowRight, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Sliders, 
  Bot 
} from "lucide-react";
import { motion } from "motion/react";
import { SlidingTextButton } from "./ui/sliding-text-button";
import { QUIZ_QUESTIONS, getRecommendedTier } from "../data/faqData";

export function FAQQuiz() {
  const [quizStep, setQuizStep] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSelectQuizOption = (points: number) => {
    const nextAnswers = [...answers, points];
    setAnswers(nextAnswers);
    if (quizStep < QUIZ_QUESTIONS.length) {
      setQuizStep(prev => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(1);
    setAnswers([]);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const recommendedTier = getRecommendedTier(totalScore);

  return (
    <motion.div id="quiz-block" className="ethereal-card-shell reveal-up mb-16" whileHover={{ scale: 1.01 }}>
      <div className="ethereal-card-core p-8 md:p-12 !bg-[rgba(11,11,11,0.6)] backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[var(--color-tertiary)] opacity-[0.03] rounded-full blur-[60px] pointer-events-none" />
        
        {quizStep === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center mx-auto mb-6">
              <Sliders className="w-5 h-5 text-[var(--color-tertiary)]" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-2xl text-white tracking-widest uppercase mb-3">
              Is Your Business Ready For Automation?
            </h3>
            <p className="font-body text-body-sm text-[var(--color-muted)] max-w-lg mx-auto mb-8">
              Complete our 3-question operational diagnostic to evaluate your lead processing gaps and map out our recommended recovery action logic.
            </p>
            <SlidingTextButton
              onClick={() => setQuizStep(1)}
              className="mx-auto"
            >
              Start Diagnostic Tool
              <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                <ArrowRight className="w-4 h-4 text-[#050505]" />
              </div>
            </SlidingTextButton>
          </div>
        ) : quizStep <= QUIZ_QUESTIONS.length ? (
          <div>
            {/* Progress Indicators */}
            <div className="flex items-center gap-1 mb-8">
              {QUIZ_QUESTIONS.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1 flex-1 transition-colors duration-300 ${index < quizStep - 1 ? 'bg-[var(--color-tertiary)]' : index === quizStep - 1 ? 'bg-[rgba(249,115,22,0.3)]' : 'bg-[#1e1e1e]'}`}
                />
              ))}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/30 px-2 py-0.5 font-bold">
                STEP 0{quizStep} OF 0{QUIZ_QUESTIONS.length}
              </span>
              <span className="font-mono text-[10px] text-[var(--color-muted-dark)] uppercase">
                {QUIZ_QUESTIONS[quizStep-1].title}
              </span>
            </div>

            <h3 className="font-display text-xl md:text-2xl text-white tracking-tight mb-8">
              {QUIZ_QUESTIONS[quizStep-1].question}
            </h3>

            <div className="space-y-3.5">
              {QUIZ_QUESTIONS[quizStep-1].options.map((option, key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectQuizOption(option.points)}
                  className="w-full text-left p-5 bg-[#161616] border border-[rgba(255,255,255,0.06)] hover:border-[var(--color-tertiary)] hover:bg-[rgba(249,115,22,0.02)] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-sans text-xs md:text-sm text-[var(--color-neutral-soft)] md:group-hover:text-white font-medium">
                    {option.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--color-muted-dark)] md:group-hover:text-[var(--color-tertiary)] transition-colors shrink-0 ml-3" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-start gap-4 mt-8 pt-4 border-t border-[rgba(255,255,255,0.04)]">
              <button
                type="button"
                onClick={() => {
                  if (quizStep > 1) {
                    setQuizStep(prev => prev - 1);
                    setAnswers(prev => prev.slice(0, -1));
                  } else {
                    setQuizStep(0);
                  }
                }}
                className="flex items-center gap-1 text-[var(--color-muted)] hover:text-white transition-colors font-mono text-[10px] uppercase tracking-wider cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" /> Back
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-left"
          >
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between pb-6 mb-8 border-b border-[rgba(255,255,255,0.05)]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-success)] font-bold mb-1 block">
                  ✓ Diagnostic Complete · Recommended Tier
                </span>
                <h3 className="font-display text-3xl text-white tracking-wider flex items-center gap-2">
                  <Award className="w-6 h-6 text-[var(--color-tertiary)] shrink-0" />
                  {recommendedTier.title}
                </h3>
              </div>
              <div className="bg-[#181818] border border-[rgba(255,255,255,0.05)] px-5 py-3 rounded-md shrink-0">
                <span className="font-mono text-[9px] uppercase block text-[var(--color-muted)] mb-0.5">ESTIMATED PRICE</span>
                <span className="font-mono text-sm text-[var(--color-tertiary)] font-bold">{recommendedTier.price}</span>
              </div>
            </div>

            <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed mb-6">
              {recommendedTier.desc} Based on your responses, here are the most impactful recovery channels we would deploy in your workflow:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {recommendedTier.deliverables.map((del, index) => (
                <div key={index} className="flex items-start gap-2.5 p-3.5 bg-[#161616] border border-[rgba(255,255,255,0.04)] rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)] mt-1.5 shrink-0" />
                  <span className="font-sans text-xs text-[var(--color-neutral-soft)] font-medium">{del}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.15)] rounded-md mb-8">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-success)] font-black block mb-1">PRO TIP FOR YOUR FLOW:</span>
              <p className="font-sans text-xs text-white tracking-wide leading-relaxed">{recommendedTier.conversionTip}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <SlidingTextButton
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-chatbot", {
                      detail: `Hi! I completed the ready-for-automation diagnostic quiz and recommended the ${recommendedTier.title}. Can you provide details on what's next?`
                    })
                  );
                }}
                className="w-full sm:w-auto"
              >
                Discuss Result With Agent
                <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                  <Bot className="w-4 h-4 text-[#050505]" />
                </div>
              </SlidingTextButton>

              <button
                type="button"
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-white transition-colors font-mono text-[10px] uppercase tracking-wider cursor-pointer py-3.5 px-3"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-take Quiz
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
