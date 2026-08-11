import { motion } from "framer-motion";

const COLORS = ["#E8A23D", "#1F4D3E", "#8B3A62", "#F4EFD8"];
const PIECES = Array.from({ length: 14 }, (_, i) => i);

export default function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-0 z-20">
      {PIECES.map((i) => {
        const angle = (i / PIECES.length) * Math.PI * 2;
        const distance = 60 + Math.random() * 70;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance - 40;
        const color = COLORS[i % COLORS.length];
        const size = 5 + Math.random() * 4;
        const isCircle = i % 2 === 0;

        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x,
              y,
              scale: [0, 1, 1],
              rotate: (i % 2 === 0 ? 1 : -1) * (180 + Math.random() * 180),
            }}
            transition={{ duration: 0.9 + Math.random() * 0.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "20px",
              width: size,
              height: size,
              background: color,
              borderRadius: isCircle ? "50%" : "2px",
            }}
          />
        );
      })}
    </div>
  );
}
