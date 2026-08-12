import { motion } from "framer-motion";
import ScreenShell from "../ScreenShell";
import Question from "../Question";
import PrimaryButton from "../PrimaryButton";
import { CATEGORIES } from "../../lib/constants";
import { playSelect, playBack } from "../../lib/sound";

export default function StepCategories({ form, setForm, onNext }) {
  const toggle = (id) => {
    const isSelecting = !form.categories.includes(id);
    isSelecting ? playSelect() : playBack();
    setForm((f) => {
      const has = f.categories.includes(id);
      return { ...f, categories: has ? f.categories.filter((c) => c !== id) : [...f.categories, id] };
    });
  };

  return (
    <ScreenShell
      step={1}
      footer={
        <PrimaryButton disabled={form.categories.length === 0} onClick={onNext}>
          Continue
        </PrimaryButton>
      }
    >
      <Question
        eyebrow="Step 1"
        title="What would you like to be shopping for?"
        sub="Pick as many as apply — this helps us understand what to focus on as we get Scout ready."
      />
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const selected = form.categories.includes(c.id);
          return (
            <motion.button
              key={c.id}
              onClick={() => toggle(c.id)}
              whileTap={{ scale: 0.94 }}
              className={`flex flex-col items-start gap-2 rounded-2xl border px-3.5 py-3.5 transition-colors duration-150 ${
                selected ? "bg-forest border-forest" : "bg-white border-border"
              }`}
            >
              <motion.div
                animate={selected ? { scale: [1, 1.25, 1], rotate: [0, -8, 0] } : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                <Icon className={`w-5 h-5 ${selected ? "text-cream" : "text-forest"}`} />
              </motion.div>
              <span className={`font-body text-[13px] font-medium ${selected ? "text-cream" : "text-ink"}`}>
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      <input
        value={form.want}
        onChange={(e) => setForm((f) => ({ ...f, want: e.target.value }))}
        placeholder="Anything specific? e.g. a study desk, a certain phone model… (optional)"
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 font-body text-[13.5px] text-ink mb-6"
      />
    </ScreenShell>
  );
}
