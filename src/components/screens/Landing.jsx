import { motion } from "framer-motion";
import { Check, BarChart3 } from "lucide-react";
import ScoutBadge from "../ScoutBadge";
import PrimaryButton from "../PrimaryButton";
import AgentIllustration from "../AgentIllustration";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Landing({ onStart, onInsights, onCreateCircle }) {
  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-7 relative overflow-hidden">
      <motion.div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-marigold/10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 -left-20 w-40 h-40 rounded-full bg-forest/[0.07]"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <button
        onClick={onInsights}
        className="absolute top-5 right-5 z-20 w-7 h-7 rounded-full bg-white/70 border border-border flex items-center justify-center text-sage"
        aria-label="View demand insights"
      >
        <BarChart3 className="w-3 h-3" />
      </button>

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 flex-1 flex flex-col">
        <motion.div variants={item} className="flex items-center gap-2 mb-5">
          <ScoutBadge />
          <span className="font-display italic text-[15px] text-forest">Scout</span>
        </motion.div>

        <motion.p variants={item} className="font-mono text-[10.5px] tracking-wider text-marigold uppercase mb-2">
          Your personal shopping agent
        </motion.p>

        <motion.h1 variants={item} className="font-display text-[27px] leading-[1.15] text-ink mb-4 max-w-[300px]">
          Tell us what you need. We'll find it, compare it, and bring it to you.
        </motion.h1>

        <motion.div variants={item} className="flex flex-col gap-2 mb-5">
          {["FREE to submit a request", "Pay only after delivery"].map((t) => (
            <div key={t} className="flex items-center gap-2 rounded-full bg-forest pl-1.5 pr-4 py-1.5 w-fit">
              <span className="w-5 h-5 rounded-full bg-cream flex items-center justify-center shrink-0 text-forest">
                <Check className="w-3 h-3" strokeWidth={3} />
              </span>
              <span className="font-body text-[12.5px] font-semibold text-cream">{t}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="flex-1 flex items-center justify-center min-h-[130px] my-1">
          <AgentIllustration />
        </motion.div>

        <motion.p variants={item} className="font-body text-[13px] leading-relaxed text-sage text-center max-w-[290px] mx-auto">
          Groceries, a study chair, a power bank, or something you just can't find anywhere — skip the shop-hopping and let Scout do the searching.
        </motion.p>
      </motion.div>

      <motion.div variants={item} initial="hidden" animate="show" className="relative z-10 pt-5">
        <PrimaryButton onClick={onStart}>Find What I Need</PrimaryButton>
        <p className="font-body text-[11px] text-center text-sage/80 mt-3">No login. No forms yet. Just one tap.</p>
        <button
          onClick={onCreateCircle}
          className="w-full text-center font-body text-[12px] text-forest/80 mt-4 underline underline-offset-2"
        >
          Shopping with a group? Create a Scout Circle instead
        </button>
      </motion.div>
    </div>
  );
}
