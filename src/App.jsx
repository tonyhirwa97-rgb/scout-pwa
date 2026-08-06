import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { emptyForm } from "./lib/constants";
import { post } from "./lib/backend";
import Landing from "./components/screens/Landing";
import StepCategories from "./components/screens/StepCategories";
import StepBudget from "./components/screens/StepBudget";
import StepContact from "./components/screens/StepContact";
import Complete from "./components/screens/Complete";

const Insights = lazy(() => import("./components/screens/Insights"));

function makeSessionId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const sessionId = useRef(makeSessionId());
  const loggedVisit = useRef(false);
  const loggedInterest = useRef(false);

  useEffect(() => {
    if (loggedVisit.current) return;
    loggedVisit.current = true;
    post("visit", {}, sessionId.current);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const registerInterest = () => {
    if (loggedInterest.current) return;
    loggedInterest.current = true;
    post("interest", {}, sessionId.current);
  };

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    post("submission", form, sessionId.current).finally(() => {
      setSaving(false);
      setScreen("complete");
    });
  };

  const restart = () => {
    setForm(emptyForm);
    loggedInterest.current = false;
    setScreen("landing");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-6 px-3 bg-paper">
      <div className="w-full max-w-[430px] h-[860px] max-h-[92vh] bg-card rounded-[32px] shadow-[0_24px_60px_-15px_rgba(22,36,31,0.25)] border border-ink/5 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {screen === "landing" && (
            <Landing
              key="landing"
              onStart={() => {
                registerInterest();
                setScreen("q1");
              }}
              onInsights={() => setScreen("insights")}
            />
          )}
          {screen === "q1" && (
            <StepCategories key="q1" form={form} setForm={setForm} onNext={() => setScreen("q2")} />
          )}
          {screen === "q2" && (
            <StepBudget
              key="q2"
              form={form}
              setForm={setForm}
              onNext={() => setScreen("q3")}
              onBack={() => setScreen("q1")}
            />
          )}
          {screen === "q3" && (
            <StepContact
              key="q3"
              form={form}
              setForm={setForm}
              onSubmit={submit}
              onBack={() => setScreen("q2")}
              saving={saving}
            />
          )}
          {screen === "complete" && (
            <Complete key="complete" form={form} saveError={saveError} onRestart={restart} />
          )}
          {screen === "insights" && (
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-sage/30 border-t-sage animate-spin" />
                </div>
              }
            >
              <Insights key="insights" onClose={() => setScreen("landing")} />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
