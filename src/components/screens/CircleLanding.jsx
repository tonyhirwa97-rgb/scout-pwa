import { motion } from "framer-motion";
import { Check, Sparkles, Calendar } from "lucide-react";
import ScoutBadge from "../ScoutBadge";
import PrimaryButton from "../PrimaryButton";
import CircleSummary from "../CircleSummary";
import { LAUNCH_DATE_LABEL } from "../../lib/constants";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function CircleLanding({ circle, onJoin }) {
  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-7 relative overflow-hidden">
      <motion.div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-marigold/10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 flex-1 flex flex-col">
        <motion.div variants={item} className="flex items-center gap-2 mb-5">
          <ScoutBadge />
          <span className="font-display italic text-[15px] text-forest">Scout</span>
        </motion.div>

        {circle.isFounding && (
          <motion.div variants={item} className="flex items-center gap-1.5 rounded-full bg-plum/10 px-3 py-1 w-fit mb-3">
            <Sparkles className="w-3 h-3 text-plum" />
            <span className="font-mono text-[10.5px] tracking-wide text-plum uppercase">Founding Circle #{circle.foundingNumber}</span>
          </motion.div>
        )}

        <motion.p variants={item} className="font-mono text-[10.5px] tracking-wider text-marigold uppercase mb-2">
          You've been invited
        </motion.p>

        <motion.h1 variants={item} className="font-display text-[26px] leading-[1.18] text-ink mb-2 max-w-[300px]">
          Join <span className="italic text-forest">{circle.name}</span>'s Scout Circle
        </motion.h1>

        <motion.p variants={item} className="font-body text-[13.5px] leading-relaxed text-sage mb-5 max-w-[300px]">
          Most of us already shop with the people around us. Scout is being built to make that easier — share what your circle would like, and you'll be among the first to know once we're ready to start finding and delivering it.
        </motion.p>

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

        <motion.div variants={item} className="flex items-center gap-1.5 rounded-full bg-marigold/12 border border-marigold/30 pl-2 pr-3 py-1.5 w-fit mb-5">
          <Calendar className="w-3.5 h-3.5 text-marigold" />
          <span className="font-body text-[11.5px] font-medium text-ink">
            Real ordering begins <span className="font-semibold">{LAUNCH_DATE_LABEL}</span>
          </span>
        </motion.div>

        <motion.div variants={item} className="mb-2">
          <CircleSummary circle={circle} />
        </motion.div>
      </motion.div>

      <motion.div variants={item} initial="hidden" animate="show" className="relative z-10 pt-5">
        <PrimaryButton onClick={onJoin}>Join {circle.name}</PrimaryButton>
        <p className="font-body text-[11px] text-center text-sage/80 mt-3">No login. Just tell us what you need.</p>
      </motion.div>
    </div>
  );
}
