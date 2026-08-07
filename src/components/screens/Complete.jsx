import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles, Copy, Check as CheckIcon } from "lucide-react";
import ScoutBadge from "../ScoutBadge";
import { CATEGORIES } from "../../lib/constants";
import { getWhatsAppLink, circleShareUrl } from "../../lib/backend";

function ReceiptRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="font-body text-[12px] text-sage shrink-0">{label}</span>
      <span className="font-body text-[13px] text-ink text-right leading-snug">{value || "—"}</span>
    </div>
  );
}

export default function Complete({ form, saveError, circleCode, circleName, onRestart, onBuildCircle }) {
  const catLabels = CATEGORIES.filter((c) => form.categories.includes(c.id)).map((c) => c.label).join(", ");
  const whatsappLink = getWhatsAppLink();
  const [copied, setCopied] = useState(false);

  const copyCircleLink = () => {
    if (!circleCode) return;
    navigator.clipboard?.writeText(circleShareUrl(circleCode)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-full flex flex-col px-6 py-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex items-center gap-2 mb-6">
          <ScoutBadge pulse={false} ping />
          <span className="font-display italic text-[15px] text-forest">Scout</span>
        </div>

        <p className="font-mono text-[11px] tracking-wider text-marigold uppercase mb-2">Request logged</p>
        <h2 className="font-display text-[26px] leading-tight text-ink mb-2">Scout is on the hunt.</h2>
        <p className="font-body text-[13.5px] text-sage mb-6 leading-snug">
          You're among the first people helping us build a smarter way to shop. We'll reach out the moment we find a match.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-white rounded-t-2xl border border-border px-5 pt-5 pb-6 relative"
        >
          <p className="font-mono text-[10px] tracking-widest text-sage/70 uppercase mb-3">Search ticket</p>
          <div className="flex flex-col gap-2.5 mb-4">
            <ReceiptRow label="Looking for" value={catLabels} />
            {form.want && <ReceiptRow label="Details" value={form.want} />}
            <ReceiptRow label="Budget" value={form.budget} />
            <ReceiptRow label="For" value={form.name} />
          </div>
          <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
            <span className="font-mono text-[11px] text-sage/70">DUE TODAY</span>
            <span className="font-display text-[18px] text-forest">K0.00</span>
          </div>
        </motion.div>
        <div className="h-3 receipt-edge -mt-px" />

        {saveError && (
          <p className="font-body text-[11.5px] text-plum mt-4 text-center">
            We couldn't sync this one to our servers just now, but your request has been noted.
          </p>
        )}

        {circleCode ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 rounded-2xl bg-forest px-4 py-3.5"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-marigold" />
              <p className="font-body text-[12.5px] font-semibold text-cream">
                You're shopping with {circleName || "your Circle"}
              </p>
            </div>
            <p className="font-body text-[12px] text-cream/75 mb-3 leading-snug">
              Bring more people in — everyone's requests land in the same Circle.
            </p>
            <button
              onClick={copyCircleLink}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cream/10 py-2.5 text-cream font-body text-[12.5px] font-medium"
            >
              {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Link copied" : "Copy invite link"}
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onBuildCircle}
            className="mt-5 w-full text-left rounded-2xl border border-forest/20 bg-forest/[0.05] px-4 py-3.5"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-forest" />
              <p className="font-body text-[12.5px] font-semibold text-forest">Build your Scout Circle</p>
            </div>
            <p className="font-body text-[12px] text-sage leading-snug">
              Your Circle helps decide what Scout sources first — founding circles get early access.
            </p>
          </motion.button>
        )}
      </motion.div>

      <div className="mt-auto pt-6 flex flex-col gap-2.5">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full font-body font-semibold text-[14px] rounded-2xl py-3.5 flex items-center justify-center gap-2 bg-[#25D366] text-white"
        >
          <MessageCircle className="w-4 h-4" />
          Join our WhatsApp for updates
        </a>
        <button
          onClick={onRestart}
          className="w-full font-body font-semibold text-[14px] rounded-2xl py-3.5 border border-border text-ink"
        >
          Start another search
        </button>
      </div>
    </div>
  );
}
