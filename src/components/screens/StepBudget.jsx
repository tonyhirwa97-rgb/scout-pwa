import { motion } from "framer-motion";
import ScreenShell from "../ScreenShell";
import Question from "../Question";
import PrimaryButton from "../PrimaryButton";
import TrustNote from "../TrustNote";
import { BUDGETS } from "../../lib/constants";
import { playSelect } from "../../lib/sound";

export default function StepBudget({ form, setForm, onNext, onBack }) {
  const select = (b) => {
    playSelect();
    setForm((f) => ({ ...f, budget: b }));
  };

  return (
    <ScreenShell
      step={2}
      onBack={onBack}
      footer={
        <PrimaryButton disabled={!form.budget} onClick={onNext}>
          Continue
        </PrimaryButton>
      }
    >
      <Question
        eyebrow="Step 2"
        title="What price range should we search in?"
        sub="This just helps us skip options that don't fit — it's not a price you're agreeing to. You'll always see the exact cost before paying anything."
      />
      <div className="flex flex-col gap-2 mb-4">
        {BUDGETS.map((b) => {
          const selected = form.budget === b;
          const isNoCommitment = b === "Not sure yet";
          return (
            <motion.button
              key={b}
              onClick={() => select(b)}
              whileTap={{ scale: 0.97 }}
              className={`font-body text-[13.5px] px-3.5 py-2.5 rounded-xl border text-left transition-colors duration-150 ${
                selected
                  ? "bg-forest border-forest text-cream"
                  : isNoCommitment
                  ? "bg-white border-border border-dashed text-sage"
                  : "bg-white border-border text-ink"
              }`}
            >
              {b}
              {isNoCommitment && !selected && (
                <span className="text-sage/70"> — totally fine, no pressure</span>
              )}
            </motion.button>
          );
        })}
      </div>
      <TrustNote
        compact
        text="We'll never ask for payment upfront, and we'll never charge more than the real price we find — your answer here doesn't change that."
      />
    </ScreenShell>
  );
}
