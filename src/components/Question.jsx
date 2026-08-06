export default function Question({ eyebrow, title, sub }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="font-mono text-[11px] tracking-wider text-marigold uppercase mb-2">{eyebrow}</p>
      )}
      <h2 className="font-display text-[24px] leading-tight text-ink mb-1.5">{title}</h2>
      {sub && <p className="font-body text-[13.5px] text-sage leading-snug">{sub}</p>}
    </div>
  );
}
