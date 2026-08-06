import { motion, AnimatePresence } from "framer-motion";
import { Search, Check } from "lucide-react";

export default function ScoutBadge({ pulse = true, ping = false }) {
  return (
    <div className="relative w-9 h-9 shrink-0">
      {pulse && (
        <motion.span
          className="absolute inset-0 rounded-full bg-forest"
          animate={{ scale: [1, 1.7], opacity: [0.35, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <div className="relative w-9 h-9 rounded-full bg-forest flex items-center justify-center text-cream">
        <AnimatePresence mode="wait">
          {ping ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Check className="w-4 h-4" strokeWidth={3} />
            </motion.span>
          ) : (
            <motion.span key="search" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Search className="w-4 h-4" strokeWidth={2.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
