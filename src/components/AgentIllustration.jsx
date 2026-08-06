import { motion } from "framer-motion";

export default function AgentIllustration() {
  return (
    <div className="float-anim">
      <svg viewBox="0 0 300 170" className="w-full max-w-[280px]" fill="none">
        <ellipse cx="150" cy="152" rx="120" ry="8" fill="#1F4D3E" opacity="0.06" />

        <motion.path
          d="M 190 100 C 160 85, 130 85, 105 95"
          stroke="#E8A23D"
          strokeWidth="2"
          strokeDasharray="4 5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
        <path d="M 108 92 L 105 95 L 110 99" stroke="#E8A23D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        <line x1="38" y1="55" x2="38" y2="118" stroke="#1F4D3E" strokeWidth="3" strokeLinecap="round" />
        <line x1="118" y1="55" x2="118" y2="118" stroke="#1F4D3E" strokeWidth="3" strokeLinecap="round" />
        <path d="M 38 100 Q 78 128 118 100" stroke="#1F4D3E" strokeWidth="3" fill="none" strokeLinecap="round" />

        <ellipse cx="78" cy="103" rx="30" ry="11" fill="#E8A23D" opacity="0.9" />
        <circle cx="52" cy="97" r="9" fill="#16241F" opacity="0.85" />
        <rect x="45" y="112" width="7" height="11" rx="1.5" fill="#1F4D3E" />
        <rect x="30" y="130" width="8" height="10" rx="1.5" fill="#1F4D3E" opacity="0.7" />
        <line x1="30" y1="130" x2="38" y2="130" stroke="#1F4D3E" strokeWidth="1.5" opacity="0.7" />

        <circle cx="222" cy="82" r="9" fill="#1F4D3E" />
        <rect x="211" y="93" width="22" height="30" rx="9" fill="#1F4D3E" />
        <rect x="196" y="108" width="16" height="18" rx="3" fill="#E8A23D" />
        <path d="M 200 108 Q 200 100 204 100 Q 208 100 208 108" stroke="#E8A23D" strokeWidth="2" fill="none" />
        <rect x="232" y="106" width="16" height="20" rx="3" fill="#8B3A62" opacity="0.85" />
        <path d="M 236 106 Q 236 98 240 98 Q 244 98 244 106" stroke="#8B3A62" strokeWidth="2" fill="none" opacity="0.85" />

        <motion.g
          animate={{ rotate: [0, 10, 0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "238px", originY: "70px" }}
        >
          <circle cx="238" cy="70" r="7" stroke="#E8A23D" strokeWidth="2.5" fill="#FBFCFA" />
          <line x1="243" y1="75" x2="249" y2="81" stroke="#E8A23D" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>

        <line x1="217" y1="123" x2="213" y2="140" stroke="#1F4D3E" strokeWidth="4" strokeLinecap="round" />
        <line x1="227" y1="123" x2="231" y2="140" stroke="#1F4D3E" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
