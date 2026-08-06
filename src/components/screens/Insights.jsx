import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { fetchStats } from "../../lib/backend";
import { CATEGORIES } from "../../lib/constants";

function FunnelRow({ label, value, max, note }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-body text-[12.5px] text-cream/90">{label}</span>
        <motion.span
          className="font-display text-[17px] text-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {value}
        </motion.span>
      </div>
      <div className="h-1.5 rounded-full bg-cream/15 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-marigold"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      {note && <p className="font-mono text-[10px] text-cream/50 mt-1">{note}</p>}
    </div>
  );
}

function MiniBarChart({ data }) {
  if (!data.length) return null;
  return (
    <div style={{ width: "100%", height: data.length * 34 + 10 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={112}
            tick={{ fontSize: 12, fill: "#6B7A73", fontFamily: "Plus Jakarta Sans" }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={10} animationDuration={600}>
            {data.map((_, i) => (
              <Cell key={i} fill="#E8A23D" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Insights({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchStats()
      .then((data) => mounted && (setStats(data), setLoading(false)))
      .catch(() => mounted && (setError(true), setLoading(false)));
    return () => {
      mounted = false;
    };
  }, []);

  const catData = stats
    ? Object.entries(stats.catCounts || {})
        .map(([id, count]) => ({
          name: CATEGORIES.find((c) => c.id === id)?.label || id,
          count,
        }))
        .sort((a, b) => b.count - a.count)
    : [];

  const budgetData = stats
    ? Object.entries(stats.budgetCounts || {})
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    : [];

  const visits = stats?.visits || 0;
  const interested = stats?.interested || 0;
  const total = stats?.total || 0;
  const interestRate = visits > 0 ? Math.round((interested / visits) * 100) : 0;
  const completeRate = interested > 0 ? Math.round((total / interested) * 100) : 0;
  const maxVal = Math.max(1, visits);

  return (
    <div className="h-full flex flex-col px-6 py-7 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[11px] tracking-wider text-marigold uppercase mb-1">Live from your Sheet</p>
          <h2 className="font-display text-[22px] text-ink">Demand insights</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-sage">
          <X className="w-4 h-4" />
        </button>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-sage animate-spin" />
        </div>
      )}

      {!loading && error && (
        <p className="font-body text-[13px] text-sage">
          Insights aren't connected yet — check config.js for the Apps Script URL.
        </p>
      )}

      {!loading && !error && stats && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-forest px-5 py-4">
            <p className="font-body text-[11.5px] text-cream/70 mb-3">Interest funnel</p>
            <div className="flex flex-col gap-3">
              <FunnelRow label="Visited the app" value={visits} max={maxVal} />
              <FunnelRow label="Interested — tapped the button" value={interested} max={maxVal} note={`${interestRate}% of visits`} />
              <FunnelRow label="Completed a request" value={total} max={maxVal} note={`${completeRate}% of interested`} />
            </div>
          </div>

          {total === 0 ? (
            <p className="font-body text-[13px] text-sage">
              No completed requests yet — the funnel above already tracks visits and taps.
            </p>
          ) : (
            <>
              {catData.length > 0 && (
                <div>
                  <p className="font-body text-[12px] font-semibold text-ink mb-2.5">Most requested categories</p>
                  <MiniBarChart data={catData} />
                </div>
              )}
              {budgetData.length > 0 && (
                <div>
                  <p className="font-body text-[12px] font-semibold text-ink mb-2.5">Budget distribution</p>
                  <MiniBarChart data={budgetData} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
