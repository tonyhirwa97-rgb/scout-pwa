import { User, Phone, MapPin, Send } from "lucide-react";
import ScreenShell from "../ScreenShell";
import Question from "../Question";
import PrimaryButton from "../PrimaryButton";
import TrustNote from "../TrustNote";

function Field({ icon: Icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="relative">
      <Icon className="w-4 h-4 text-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-3 font-body text-[14px] text-ink"
      />
    </div>
  );
}

export default function StepContact({ form, setForm, onSubmit, onBack, saving }) {
  const canSubmit = form.name.trim() && form.phone.trim() && !saving;

  return (
    <ScreenShell
      step={3}
      onBack={onBack}
      footer={
        <PrimaryButton disabled={!canSubmit} onClick={onSubmit} icon={Send} spinning={saving}>
          {saving ? "Sending…" : "Send to Scout"}
        </PrimaryButton>
      }
    >
      <Question eyebrow="Last step" title="Where should Scout send this?" sub="So we can reach you the moment it's found." />
      <div className="flex flex-col gap-3 mb-4">
        <Field
          icon={User}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
        />
        <Field
          icon={Phone}
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="Phone number, e.g. 097X XXX XXX"
          type="tel"
        />
        <Field
          icon={MapPin}
          value={form.area}
          onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
          placeholder="Area, e.g. Matero, Lusaka (optional)"
        />
      </div>
      <TrustNote />
    </ScreenShell>
  );
}
