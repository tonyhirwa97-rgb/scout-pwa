import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { SUGGESTED_QUESTIONS, matchFaq } from "../lib/faq";
import { getWhatsAppLink } from "../lib/backend";
import { playTap, playSelect } from "../lib/sound";

const FALLBACK_ANSWER =
  "I don't have an answer for that one yet — join our WhatsApp group and ask us directly, we're happy to help.";

function makeGreeting() {
  return {
    id: "greeting",
    from: "bot",
    text: "Hi! I'm the Scout assistant. Ask me anything about how this works, or tap a question below.",
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([makeGreeting()]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const whatsappLink = getWhatsAppLink();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const ask = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: `u-${Date.now()}`, from: "user", text };
    const match = matchFaq(text);
    const botMsg = {
      id: `b-${Date.now()}`,
      from: "bot",
      text: match ? match.answer : FALLBACK_ANSWER,
      showWhatsapp: !match,
    };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  };

  const handleSuggested = (q) => {
    playSelect();
    ask(q);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    playTap();
    ask(input);
  };

  const toggleOpen = () => {
    playTap();
    setOpen((o) => !o);
  };

  return (
    <div className="absolute bottom-5 right-5 z-30">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-14 right-0 w-[300px] max-w-[80vw] h-[380px] bg-card rounded-2xl shadow-[0_16px_40px_-8px_rgba(22,36,31,0.3)] border border-border flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-forest shrink-0">
              <span className="font-display italic text-[14px] text-cream">Scout Assistant</span>
              <button onClick={toggleOpen} className="text-cream/80">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 font-body text-[12.5px] leading-snug ${
                      m.from === "user" ? "bg-marigold text-ink" : "bg-forest/8 text-ink"
                    }`}
                  >
                    {m.text}
                    {m.showWhatsapp && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1.5 text-[11.5px] font-semibold text-forest underline"
                      >
                        Open WhatsApp →
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {messages.length <= 1 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggested(q)}
                      className="text-left font-body text-[12px] text-forest bg-forest/6 border border-forest/15 rounded-xl px-3 py-2"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 border-t border-border shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question…"
                className="flex-1 rounded-full border border-border bg-white px-3.5 py-2 font-body text-[12.5px] text-ink"
              />
              <button
                onClick={handleSend}
                className="w-8 h-8 rounded-full bg-marigold flex items-center justify-center text-ink shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        whileTap={{ scale: 0.92 }}
        className="w-13 h-13 rounded-full bg-forest shadow-[0_8px_20px_-4px_rgba(31,77,62,0.5)] flex items-center justify-center text-cream"
        style={{ width: 52, height: 52 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <MessageCircle className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
