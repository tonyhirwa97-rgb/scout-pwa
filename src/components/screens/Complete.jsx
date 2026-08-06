import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ScoutBadge from "../ScoutBadge";
import { CATEGORIES } from "../../lib/constants";
import { getWhatsAppLink } from "../../lib/backend";

function ReceiptRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="font-body text-[12px] text-sage shrink-0">{label}</span>
      <span className="font-body text-[13px] text-ink text-right leading-snug">{value || "—"}</span>
    </div>
  );
}

export default function Complete({ form, saveError, onRestart }) {
  const catLabels = CATEGORIES.filter((c) => form.categories.includes(c.id)).map((c) => c.label).join(", ");
  const whatsappLink = getWhatsAppLink();

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
