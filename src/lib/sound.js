// Scout — sound effects
// -----------------------
// Tiny synthesized tones via the Web Audio API. No audio files to
// download, works offline, and stays under a kilobyte. Sounds are
// deliberately soft and short - felt more than heard.

let ctx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    ctx = new AudioContextClass();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone({ freq, duration = 0.09, type = "sine", gain = 0.05, glideTo = null }) {
  const audioCtx = getContext();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  if (glideTo) {
    osc.frequency.exponentialRampToValueAtTime(glideTo, audioCtx.currentTime + duration);
  }

  gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// A soft, high, short click - for taps and selections.
export function playTap() {
  tone({ freq: 720, duration: 0.06, type: "sine", gain: 0.045 });
}

// A slightly warmer double-tick - for toggling something on.
export function playSelect() {
  tone({ freq: 560, duration: 0.05, type: "sine", gain: 0.04 });
  setTimeout(() => tone({ freq: 840, duration: 0.06, type: "sine", gain: 0.035 }), 40);
}

// A rising two-note chime - for completing something meaningful.
export function playSuccess() {
  tone({ freq: 520, duration: 0.11, type: "sine", gain: 0.05 });
  setTimeout(() => tone({ freq: 780, duration: 0.16, type: "sine", gain: 0.05 }), 90);
}

// A soft low thud - for going back or dismissing.
export function playBack() {
  tone({ freq: 300, duration: 0.07, type: "sine", gain: 0.035, glideTo: 220 });
}

// A gentle descending tone - for errors, without being harsh.
export function playError() {
  tone({ freq: 340, duration: 0.14, type: "sine", gain: 0.04, glideTo: 220 });
}
