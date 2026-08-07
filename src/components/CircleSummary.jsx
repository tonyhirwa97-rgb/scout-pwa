import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { CATEGORIES } from "../lib/constants";

export default function CircleSummary({ circle }) {
  const { memberCount = 0, catCounts = {} } = circle;
  const entries = Object.entries(catCounts)
    .map(([id, count]) => ({
      label: CATEGORIES.find((c) => c.id === id)?.label || id,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const max = Math.max(1, ...entries.map((e) => e.count));

  return (
    <div className="rounded-2xl bg-forest px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-cream/80" />
        <p className="font-body text-[12.5px] text-cream/90">
          {memberCount === 0
            ? "No requests yet — be the first"
            : `${memberCount} request${memberCount === 1 ? "" : "s"} so far`}
        </p>
      </div>

      {entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((e, i) => (
            <div key={e.label} className="flex items-center gap-3">
              <span className="font-body text-[12px] text-cream/80 w-[110px] shrink-0 truncate">{e.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-cream/15 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-marigold"
                  initial={{ width: 0 }}
                  animate={{ width: `${(e.count / max) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
              <span className="font-mono text-[10.5px] text-cream/60 w-4 text-right">{e.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
