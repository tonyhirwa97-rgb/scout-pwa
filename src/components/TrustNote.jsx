import { ShieldCheck } from "lucide-react";

export default function TrustNote({ compact = false, text }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl bg-forest/[0.06] border border-forest/10 px-3 ${compact ? "py-2" : "py-3"}`}>
      <ShieldCheck className="w-4 h-4 text-forest mt-0.5 shrink-0" />
      <p className="font-body text-[12.5px] leading-snug text-forest/85">
        {text || "Asking is free. You only pay once your item is found and delivered."}
      </p>
    </div>
  );
}
