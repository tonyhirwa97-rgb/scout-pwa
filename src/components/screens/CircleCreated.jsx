import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check as CheckIcon, MessageCircle } from "lucide-react";
import ScoutBadge from "../ScoutBadge";
import ConfettiBurst from "../ConfettiBurst";
import CircleSummary from "../CircleSummary";
import { circleShareUrl } from "../../lib/backend";
import { playSuccess, playTap } from "../../lib/sound";

export default function CircleCreated({ circle, onContinue }) {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const link = circleShareUrl(circle.code);

  useEffect(() => {
    playSuccess();
    const t = setTimeout(() => setShowConfetti(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const copyLink = () => {
    playTap();
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const whatsappShareText = encodeURIComponent(
    `I've started a Scout Circle called "${circle.name}" — tell Scout what you need and it'll find it, compare it, and bring it to you. Free to ask, pay only after delivery.\n\nJoin here: ${link}`
  );

  return (
    <div className="h-full flex flex-col px-6 py-8 overflow-y-auto relative">
      {showConfetti && <ConfettiBurst />}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-2 mb-6">
          <ScoutBadge pulse={false} ping />
          <span className="font-display italic text-[15px] text-forest">Scout</span>
        </div>

        {circle.isFounding && (
          <div className="flex items-center gap-1.5 rounded-full bg-plum/10 px-3 py-1 w-fit mb-3">
            <Sparkles className="w-3 h-3 text-plum" />
            <span className="font-mono text-[10.5px] tracking-wide text-plum uppercase">
              Founding Circle #{circle.foundingNumber}
            </span>
          </div>
        )}

        <p className="font-mono text-[11px] tracking-wider text-marigold uppercase mb-2">Circle created</p>
        <h2 className="font-display text-[26px] leading-tight text-ink mb-2">{circle.name} is ready.</h2>
        <p className="font-body text-[13.5px] text-sage mb-6 leading-snug">
          Share this link — anyone who opens it can request what they need, tagged straight to your Circle.
        </p>

        <div className="rounded-2xl border border-border bg-white px-4 py-3 mb-3 flex items-center gap-2">
          <span className="font-mono text-[12px] text-ink truncate flex-1">{link}</span>
          <button
            onClick={copyLink}
            className="w-8 h-8 rounded-full bg-forest/8 flex items-center justify-center text-forest shrink-0"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <a
          href={`https://wa.me/?text=${whatsappShareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full font-body font-semibold text-[14px] rounded-2xl py-3.5 flex items-center justify-center gap-2 bg-[#25D366] text-white mb-6"
        >
          <MessageCircle className="w-4 h-4" />
          Share on WhatsApp
        </a>

        <CircleSummary circle={{ ...circle, memberCount: 0, catCounts: {} }} />
      </motion.div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => {
            playTap();
            onContinue();
          }}
          className="w-full font-body font-semibold text-[14px] rounded-2xl py-3.5 border border-border text-ink"
        >
          Continue to my own request
        </button>
      </div>
    </div>
  );
}
