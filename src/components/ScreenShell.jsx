import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ScoutBadge from "./ScoutBadge";
import ProgressBar from "./ProgressBar";

export default function ScreenShell({ step, onBack, children, footer }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <ScoutBadge pulse={false} />
          <span className="font-display italic text-[15px] text-forest">Scout</span>
        </div>
        <ProgressBar step={step} />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="flex-1 overflow-y-auto px-5 pb-3"
      >
        {children}
      </motion.div>

      {onBack && (
        <div className="px-5 pt-1 pb-2 shrink-0">
          <button onClick={onBack} className="font-body text-[13.5px] text-sage flex items-center gap-1.5 py-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>
      )}

      {footer && (
        <div className="px-5 pb-5 pt-3 bg-gradient-to-t from-card via-card to-transparent">{footer}</div>
      )}
    </div>
  );
}
