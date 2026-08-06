import { motion } from "framer-motion";
import { TOTAL_STEPS } from "../lib/constants";

export default function ProgressBar({ step }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[11px] tracking-wide text-sage">
          STEP {String(step).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
        </span>
        <span className="font-mono text-[11px] tracking-wide text-sage">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-forest"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
