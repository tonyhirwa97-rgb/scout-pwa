import { LAUNCH_DATE_LABEL } from "./constants";

// Each entry: keywords are checked as substrings against the lowercased
// user question. First match wins, so order roughly most-specific-first
// where overlap could occur.
export const FAQS = [
  {
    id: "what-is-scout",
    question: "What is Scout?",
    keywords: ["what is scout", "what's scout", "about scout", "what do you do", "how does this work"],
    answer:
      "Scout is a personal shopping agent. You tell us what you need, we search and compare it across stores, and bring it to you. Right now we're gathering interest before real ordering begins.",
  },
  {
    id: "is-it-free",
    question: "Is this free?",
    keywords: ["free", "cost", "price", "how much", "pay"],
    answer: `Yes — requesting is 100% free. You only pay once your item is actually found and delivered. Real ordering begins ${LAUNCH_DATE_LABEL}.`,
  },
  {
    id: "is-it-scam",
    question: "Is this a scam?",
    keywords: ["scam", "trust", "safe", "legit", "real"],
    answer:
      "Totally fair question. We never ask for payment upfront, and you'll always see the exact price before paying anything. We're a small team being upfront that real ordering hasn't started yet — that's the whole point of this stage.",
  },
  {
    id: "launch-date",
    question: "When does ordering start?",
    keywords: ["when", "start", "launch", "begin", "date"],
    answer: `Real ordering begins ${LAUNCH_DATE_LABEL}. Register now and we'll reach out to you then.`,
  },
  {
    id: "circles",
    question: "How do Scout Circles work?",
    keywords: ["circle", "group", "family", "roommate", "classmate"],
    answer:
      "A Scout Circle lets your family, roommates, or classmates share one link — everyone's requests land in the same group, and you can see what's been requested so far.",
  },
  {
    id: "what-can-i-request",
    question: "What can I request?",
    keywords: ["what can i", "categories", "products", "items", "shopping for"],
    answer:
      "Pretty much anything — electronics, groceries, clothes, furniture, books, and more. Just tell us what you're looking for on the request screen.",
  },
  {
    id: "contact",
    question: "How do I reach a real person?",
    keywords: ["contact", "human", "person", "talk to", "whatsapp"],
    answer:
      "Join our WhatsApp group from the completion screen after registering — that's the fastest way to reach us directly.",
  },
];

export const SUGGESTED_QUESTIONS = [
  "Is this free?",
  "Is this a scam?",
  "When does ordering start?",
  "How do Circles work?",
];

export function matchFaq(input) {
  const q = (input || "").toLowerCase().trim();
  if (!q) return null;
  const found = FAQS.find((f) => f.keywords.some((k) => q.includes(k)));
  return found || null;
}
