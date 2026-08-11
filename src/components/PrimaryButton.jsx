import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { playTap } from "../lib/sound";

export default function PrimaryButton({ children, onClick, disabled, icon: Icon = ArrowRight, spinning = false }) {
  const handleClick = (e) => {
    if (disabled) return;
    playTap();
    onClick?.(e);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={`w-full font-body font-semibold text-[15px] rounded-2xl py-4 flex items-center justify-center gap-2 transition-colors duration-150 ${
        disabled
          ? "bg-border text-sage/70 cursor-not-allowed"
          : "bg-marigold text-ink shadow-[0_4px_14px_rgba(232,162,61,0.35)]"
      }`}
    >
      <span>{children}</span>
      {spinning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
    </motion.button>
  );
}
