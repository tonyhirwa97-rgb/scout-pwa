import { motion } from "framer-motion";
import { ArrowLeft, Search, Shirt, Home, Sparkles } from "lucide-react";
import ScoutBadge from "../ScoutBadge";
import { playBack } from "../../lib/sound";
import { LAUNCH_DATE_LABEL } from "../../lib/constants";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

const PILLARS = [
  {
    icon: Search,
    title: "Compare across every store",
    body: "Search once, see the same product across every store that carries it — price, quality, and real reviews, side by side.",
  },
  {
    icon: Shirt,
    title: "Try it on first",
    body: "See how clothing actually looks on you before it's delivered — no more guessing sizes or colors.",
  },
  {
    icon: Home,
    title: "Find your next home",
    body: "The same side-by-side comparison, extended to houses — search, compare, and evaluate available homes through agents.",
  },
];

export default function Vision({ onBack }) {
  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-7 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <ScoutBadge pulse={false} />
        <span className="font-display italic text-[15px] text-forest">Scout</span>
      </div>

      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="flex items-center gap-1.5 rounded-full bg-forest/8 px-3 py-1 w-fit mb-4">
          <Sparkles className="w-3 h-3 text-forest" />
          <span className="font-mono text-[10.5px] tracking-wide text-forest uppercase">Not live yet — the vision</span>
        </motion.div>

        <motion.h1 variants={item} className="font-display text-[26px] leading-[1.2] text-ink mb-3 max-w-[300px]">
          Scout today is the beginning.
        </motion.h1>

        <motion.p variants={item} className="font-body text-[13.5px] leading-relaxed text-sage mb-3 max-w-[310px]">
          Right now, Scout helps you request what you need and bring your
          people in. Real ordering begins {LAUNCH_DATE_LABEL} — everything
          below is what comes after that, not something you can do today,
          but what your interest is helping us build toward.
        </motion.p>

        <div className="flex flex-col gap-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                variants={item}
                className="rounded-2xl border border-border bg-white px-4 py-4"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-full bg-forest/8 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-forest" />
                  </div>
                  <h3 className="font-display text-[16px] text-ink">{p.title}</h3>
                </div>
                <p className="font-body text-[12.5px] text-sage leading-snug pl-[42px]">{p.body}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.p variants={item} className="font-body text-[11.5px] text-sage/70 text-center mt-6 leading-snug">
          What we're actually building toward is certainty — the confidence
          of comparing everything before you commit your money or your trust.
        </motion.p>
      </motion.div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => {
            playBack();
            onBack();
          }}
          className="w-full font-body font-semibold text-[14px] rounded-2xl py-3.5 flex items-center justify-center gap-2 border border-border text-ink"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to today
        </button>
      </div>
    </div>
  );
}
