import { motion } from "framer-motion";
import ScreenShell from "../ScreenShell";
import Question from "../Question";
import PrimaryButton from "../PrimaryButton";
import TrustNote from "../TrustNote";
import { BUDGETS } from "../../lib/constants";

export default function StepBudget({ form, setForm, onNext, onBack }) {
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
      <Question eyebrow="Step 2" title="What's your budget?" sub="A rough range is fine — nothing is locked in." />
      <div className="flex flex-col gap-2 mb-4">
        {BUDGETS.map((b) => {
          const selected = form.budget === b;
          return (
            <motion.button
              key={b}
              onClick={() => setForm((f) => ({ ...f, budget: b }))}
              whileTap={{ scale: 0.97 }}
              className={`font-body text-[13.5px] px-3.5 py-2.5 rounded-xl border text-left transition-colors duration-150 ${
                selected ? "bg-forest border-forest text-cream" : "bg-white border-border text-ink"
              }`}
            >
              {b}
            </motion.button>
          );
        })}
      </div>
      <TrustNote compact />
    </ScreenShell>
  );
}
