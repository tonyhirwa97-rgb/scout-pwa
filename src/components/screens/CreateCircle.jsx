import { useState } from "react";
import { Users2, User, Phone, ArrowLeft } from "lucide-react";
import PrimaryButton from "../PrimaryButton";
import Question from "../Question";
import ScoutBadge from "../ScoutBadge";
import { createCircle } from "../../lib/backend";
import { playSelect, playBack } from "../../lib/sound";

const SUGGESTIONS = ["Family", "Roommates", "Classmates", "Workmates"];

export default function CreateCircle({ onBack, onCreated }) {
  const [name, setName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorPhone, setCreatorPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const canSubmit = name.trim() && creatorName.trim() && creatorPhone.trim() && !saving;

  const handleCreate = () => {
    if (!canSubmit) return;
    setSaving(true);
    setError(false);
    createCircle({ name, creatorName, creatorPhone })
      .then((res) => {
        if (!res || !res.ok) throw new Error("failed");
        onCreated(res);
      })
      .catch(() => setError(true))
      .finally(() => setSaving(false));
  };

  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-7">
      <div className="flex items-center gap-2 mb-6">
        <ScoutBadge pulse={false} />
        <span className="font-display italic text-[15px] text-forest">Scout</span>
      </div>

      <Question
        eyebrow="Shop together"
        title="Who do you already shop with?"
        sub="Family, roommates, classmates, workmates — build a Circle so everyone can request what they need in one place."
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              playSelect();
              setName(s);
            }}
            className={`font-body text-[12.5px] px-3 py-1.5 rounded-full border transition-colors ${
              name === s ? "bg-forest border-forest text-cream" : "bg-white border-border text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <Users2 className="w-4 h-4 text-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name your Circle, e.g. Hostel Block C"
            className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-3 font-body text-[14px] text-ink"
          />
        </div>
        <div className="relative">
          <User className="w-4 h-4 text-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-3 font-body text-[14px] text-ink"
          />
        </div>
        <div className="relative">
          <Phone className="w-4 h-4 text-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={creatorPhone}
            onChange={(e) => setCreatorPhone(e.target.value)}
            placeholder="Your phone number"
            type="tel"
            className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-3 font-body text-[14px] text-ink"
          />
        </div>
      </div>

      {error && (
        <p className="font-body text-[12px] text-plum mb-3">
          Couldn't create your Circle just now — check your connection and try again.
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2.5">
        <PrimaryButton disabled={!canSubmit} onClick={handleCreate} spinning={saving}>
          {saving ? "Creating…" : "Create My Circle"}
        </PrimaryButton>
        <button
          onClick={() => {
            playBack();
            onBack();
          }}
          className="font-body text-[13.5px] text-sage flex items-center justify-center gap-1.5 py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>
    </div>
  );
}
