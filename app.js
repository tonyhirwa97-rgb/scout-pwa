// Scout — deployable app
// A dependency-free rebuild of the prototype: same flow, same look,
// no build step. Talks to the Apps Script backend in config.js.

(function () {
  "use strict";

  const CONFIG = window.SCOUT_CONFIG || {};
  const SCRIPT_URL = CONFIG.SCRIPT_URL || "";
  const WHATSAPP_LINK = CONFIG.WHATSAPP_GROUP_LINK || "#";

  const CATEGORIES = [
    { id: "electronics", label: "Electronics", mono: "EL" },
    { id: "groceries", label: "Groceries", mono: "GR" },
    { id: "clothes", label: "Clothes", mono: "CL" },
    { id: "beauty", label: "Beauty", mono: "BE" },
    { id: "kitchen", label: "Kitchen Items", mono: "KI" },
    { id: "furniture", label: "Furniture", mono: "FU" },
    { id: "books", label: "Books", mono: "BO" },
    { id: "phone-accessories", label: "Phone Accessories", mono: "PA" },
    { id: "other", label: "Other", mono: "OT" },
  ];

  const BUDGETS = [
    "Under K200",
    "K200 – K500",
    "K500 – K1,500",
    "K1,500 – K5,000",
    "K5,000+",
    "Not sure yet",
  ];

  const TOTAL_STEPS = 3;

  const sessionId = "s-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);

  const state = {
    screen: "landing",
    form: { categories: [], want: "", budget: "", name: "", phone: "", area: "" },
    saving: false,
    saveError: false,
    loggedInterest: false,
    insights: { loading: true, error: false, data: null },
  };

  // ---------------------------------------------------------------------
  // Backend calls
  // ---------------------------------------------------------------------

  function post(type, extra) {
    if (!SCRIPT_URL || SCRIPT_URL.indexOf("PASTE_YOUR") === 0) return Promise.resolve();
    const payload = Object.assign({ type: type, sessionId: sessionId }, extra || {});
    return fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // fire-and-forget: Apps Script + no-cors means we can't read the response
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  function fetchStats() {
    if (!SCRIPT_URL || SCRIPT_URL.indexOf("PASTE_YOUR") === 0) {
      return Promise.reject(new Error("not configured"));
    }
    return fetch(SCRIPT_URL + "?action=stats").then((r) => r.json());
  }

  // ---------------------------------------------------------------------
  // Small icon set (inline SVG, no dependency)
  // ---------------------------------------------------------------------

  const ICON = {
    search:
      '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16" y2="16"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1116 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    phone:
      '<path d="M21 16.5v2.7a1.8 1.8 0 01-2 1.8 17.6 17.6 0 01-7.7-2.7 17.3 17.3 0 01-5.3-5.3A17.6 17.6 0 013.3 5.3a1.8 1.8 0 011.8-2H7.8a1.8 1.8 0 011.8 1.5c.1.9.3 1.7.5 2.5a1.8 1.8 0 01-.4 1.8l-1 1a14.1 14.1 0 005.3 5.3l1-1a1.8 1.8 0 011.8-.4c.8.2 1.6.4 2.5.5A1.8 1.8 0 0121 16.5Z"/>',
    user: '<path d="M19 20v-1.8a3.6 3.6 0 00-3.6-3.6H8.6A3.6 3.6 0 005 18.2V20"/><circle cx="12" cy="7.5" r="3.5"/>',
    send: '<line x1="21" y1="3" x2="11" y2="13"/><polygon points="21 3 15 21 11 13 3 9 21 3"/>',
    shieldCheck: '<path d="M12 21s7-3.5 7-9V6l-7-2.5L5 6v6c0 5.5 7 9 7 9Z"/><polyline points="9 11.5 11.5 14 15 9.5"/>',
    x: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
    barChart: '<line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="19" y1="20" x2="19" y2="15"/>',
    message: '<path d="M4 18l1.2-3.6A7.9 7.9 0 1112 20a8 8 0 01-8-2Z"/>',
  };

  function icon(name, cls) {
    return (
      '<svg class="' +
      (cls || "w-4 h-4") +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      ICON[name] +
      "</svg>"
    );
  }

  // ---------------------------------------------------------------------
  // Small render helpers
  // ---------------------------------------------------------------------

  function scoutBadge(opts) {
    opts = opts || {};
    const pulseClass = opts.pulse === false ? "" : " scout-pulse";
    const inner = opts.ping ? icon("check", "w-4 h-4") : icon("search", "w-4 h-4");
    return (
      '<div class="w-9 h-9 rounded-full bg-[#1F4D3E] flex items-center justify-center text-[#F4EFD8]' +
      pulseClass +
      '">' +
      inner +
      "</div>"
    );
  }

  function trustNote(compact) {
    return (
      '<div class="flex items-start gap-2 rounded-xl bg-[#1F4D3E]/6 border border-[#1F4D3E]/12 px-3 ' +
      (compact ? "py-2" : "py-3") +
      '">' +
      icon("shieldCheck", "w-4 h-4 text-[#1F4D3E] mt-0.5 shrink-0") +
      '<p class="font-body text-[12.5px] leading-snug text-[#1F4D3E]/85">Asking is free. You only pay once your item is found and delivered.</p>' +
      "</div>"
    );
  }

  function progressBar(step) {
    const pct = Math.round((step / TOTAL_STEPS) * 100);
    return (
      '<div class="w-full">' +
      '<div class="flex items-center justify-between mb-1.5">' +
      '<span class="font-mono text-[11px] tracking-wide text-[#6B7A73]">STEP 0' +
      step +
      " / 0" +
      TOTAL_STEPS +
      "</span>" +
      '<span class="font-mono text-[11px] tracking-wide text-[#6B7A73]">' +
      pct +
      "%</span></div>" +
      '<div class="h-1.5 w-full rounded-full bg-[#D9E1DA] overflow-hidden">' +
      '<div class="h-full rounded-full bg-[#1F4D3E] transition-all duration-500 ease-out" style="width:' +
      pct +
      '%"></div></div></div>'
    );
  }

  function primaryButton(id, label, opts) {
    opts = opts || {};
    const disabled = opts.disabled ? " disabled" : "";
    const disabledCls = opts.disabled
      ? "bg-[#D9E1DA] text-[#9AA6A0] cursor-not-allowed"
      : "bg-[#E8A23D] text-[#16241F] hover:bg-[#DE9527] active:scale-[0.98] shadow-[0_4px_14px_rgba(232,162,61,0.35)]";
    const iconHtml = opts.spinning
      ? '<div class="spinner"></div>'
      : icon(opts.icon || "arrowRight", "w-4 h-4");
    return (
      '<button id="' +
      id +
      '" ' +
      disabled +
      ' class="w-full font-body font-semibold text-[15px] rounded-2xl py-4 flex items-center justify-center gap-2 transition-all duration-150 ' +
      disabledCls +
      '">' +
      "<span>" +
      label +
      "</span>" +
      iconHtml +
      "</button>"
    );
  }

  function screenShell(step, backId, contentHtml) {
    return (
      '<div class="flex flex-col h-full">' +
      '<div class="px-5 pt-5 pb-3 shrink-0">' +
      '<div class="flex items-center justify-between mb-4">' +
      scoutBadge({ pulse: false }) +
      '<span class="font-display italic text-[15px] text-[#1F4D3E]">Scout</span>' +
      "</div>" +
      progressBar(step) +
      "</div>" +
      '<div class="flex-1 overflow-y-auto px-5 pb-3 step-anim">' +
      contentHtml +
      "</div>" +
      (backId
        ? '<div class="px-5 pt-1 pb-2 shrink-0"><button id="' +
          backId +
          '" class="font-body text-[13.5px] text-[#6B7A73] flex items-center gap-1.5 py-2">' +
          icon("arrowLeft", "w-3.5 h-3.5") +
          "Back</button></div>"
        : "") +
      "</div>"
    );
  }

  function question(eyebrow, title, sub) {
    return (
      '<div class="mb-5">' +
      (eyebrow
        ? '<p class="font-mono text-[11px] tracking-wider text-[#E8A23D] uppercase mb-2">' + eyebrow + "</p>"
        : "") +
      '<h2 class="font-display text-[24px] leading-tight text-[#16241F] mb-1.5">' + title + "</h2>" +
      (sub ? '<p class="font-body text-[13.5px] text-[#6B7A73] leading-snug">' + sub + "</p>" : "") +
      "</div>"
    );
  }

  function bottomNav(html) {
    return (
      '<div class="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3 bg-gradient-to-t from-[#FBFCFA] via-[#FBFCFA] to-transparent">' +
      html +
      "</div>"
    );
  }

  // ---------------------------------------------------------------------
  // Screens
  // ---------------------------------------------------------------------

  function landingScreen() {
    const badges =
      '<div class="flex flex-col gap-2 mb-5">' +
      ["FREE to submit a request", "Pay only after delivery"]
        .map(
          (t) =>
            '<div class="flex items-center gap-2 rounded-full bg-[#1F4D3E] pl-1.5 pr-4 py-1.5 w-fit">' +
            '<span class="w-5 h-5 rounded-full bg-[#F4EFD8] flex items-center justify-center shrink-0 text-[#1F4D3E]">' +
            icon("check", "w-3 h-3") +
            "</span>" +
            '<span class="font-body text-[12.5px] font-semibold text-[#F4EFD8]">' + t + "</span></div>"
        )
        .join("") +
      "</div>";

    return (
      '<div class="h-full flex flex-col px-6 pt-6 pb-7 relative overflow-hidden">' +
      '<div class="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#E8A23D]/12"></div>' +
      '<div class="absolute top-40 -left-20 w-40 h-40 rounded-full bg-[#1F4D3E]/8"></div>' +
      '<button id="btn-insights" class="absolute top-5 right-5 z-20 w-7 h-7 rounded-full bg-white/70 border border-[#D9E1DA] flex items-center justify-center text-[#9AA6A0]">' +
      icon("barChart", "w-3 h-3") +
      "</button>" +
      '<div class="hero-anim relative z-10 flex-1 flex flex-col">' +
      '<div class="flex items-center gap-2 mb-5">' +
      scoutBadge() +
      '<span class="font-display italic text-[15px] text-[#1F4D3E]">Scout</span></div>' +
      '<p class="font-mono text-[10.5px] tracking-wider text-[#E8A23D] uppercase mb-2">Your personal shopping agent</p>' +
      '<h1 class="font-display text-[27px] leading-[1.15] text-[#16241F] mb-4 max-w-[300px]">Tell us what you need. We\'ll find it, compare it, and bring it to you.</h1>' +
      badges +
      '<div class="flex-1 flex items-center justify-center min-h-[130px] my-1">' +
      agentIllustration() +
      "</div>" +
      '<p class="font-body text-[13px] leading-relaxed text-[#6B7A73] text-center max-w-[290px] mx-auto">Groceries, a study chair, a power bank, or something you just can\'t find anywhere — skip the shop-hopping and let Scout do the searching.</p>' +
      "</div>" +
      '<div class="relative z-10 pt-5">' +
      primaryButton("btn-start", "Find What I Need") +
      '<p class="font-body text-[11px] text-center text-[#9AA6A0] mt-3">No login. No forms yet. Just one tap.</p>' +
      "</div></div>"
    );
  }

  function agentIllustration() {
    return (
      '<svg viewBox="0 0 300 170" class="w-full max-w-[280px]" fill="none">' +
      '<ellipse cx="150" cy="152" rx="120" ry="8" fill="#1F4D3E" opacity="0.06"/>' +
      '<path d="M 190 100 C 160 85, 130 85, 105 95" stroke="#E8A23D" stroke-width="2" stroke-dasharray="4 5" stroke-linecap="round"/>' +
      '<path d="M 108 92 L 105 95 L 110 99" stroke="#E8A23D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
      '<line x1="38" y1="55" x2="38" y2="118" stroke="#1F4D3E" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="118" y1="55" x2="118" y2="118" stroke="#1F4D3E" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M 38 100 Q 78 128 118 100" stroke="#1F4D3E" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="78" cy="103" rx="30" ry="11" fill="#E8A23D" opacity="0.9"/>' +
      '<circle cx="52" cy="97" r="9" fill="#16241F" opacity="0.85"/>' +
      '<rect x="45" y="112" width="7" height="11" rx="1.5" fill="#1F4D3E"/>' +
      '<rect x="30" y="130" width="8" height="10" rx="1.5" fill="#1F4D3E" opacity="0.7"/>' +
      '<line x1="30" y1="130" x2="38" y2="130" stroke="#1F4D3E" stroke-width="1.5" opacity="0.7"/>' +
      '<circle cx="222" cy="82" r="9" fill="#1F4D3E"/>' +
      '<rect x="211" y="93" width="22" height="30" rx="9" fill="#1F4D3E"/>' +
      '<rect x="196" y="108" width="16" height="18" rx="3" fill="#E8A23D"/>' +
      '<path d="M 200 108 Q 200 100 204 100 Q 208 100 208 108" stroke="#E8A23D" stroke-width="2" fill="none"/>' +
      '<rect x="232" y="106" width="16" height="20" rx="3" fill="#8B3A62" opacity="0.85"/>' +
      '<path d="M 236 106 Q 236 98 240 98 Q 244 98 244 106" stroke="#8B3A62" stroke-width="2" fill="none" opacity="0.85"/>' +
      '<circle cx="238" cy="70" r="7" stroke="#E8A23D" stroke-width="2.5" fill="#FBFCFA"/>' +
      '<line x1="243" y1="75" x2="249" y2="81" stroke="#E8A23D" stroke-width="2.5" stroke-linecap="round"/>' +
      '<line x1="217" y1="123" x2="213" y2="140" stroke="#1F4D3E" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="227" y1="123" x2="231" y2="140" stroke="#1F4D3E" stroke-width="4" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function q1Screen() {
    const grid =
      '<div class="grid grid-cols-2 gap-2.5 mb-4">' +
      CATEGORIES.map((c) => {
        const selected = state.form.categories.indexOf(c.id) !== -1;
        return (
          '<button data-cat="' +
          c.id +
          '" class="cat-btn flex flex-col items-start gap-2 rounded-2xl border px-3.5 py-3.5 transition-all duration-150 ' +
          (selected
            ? "bg-[#1F4D3E] border-[#1F4D3E]"
            : "bg-white border-[#D9E1DA]") +
          '">' +
          '<span class="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] ' +
          (selected ? "bg-[#F4EFD8] text-[#1F4D3E]" : "bg-[#1F4D3E]/8 text-[#1F4D3E]") +
          '">' +
          c.mono +
          "</span>" +
          '<span class="font-body text-[13px] font-medium ' +
          (selected ? "text-[#F4EFD8]" : "text-[#16241F]") +
          '">' +
          c.label +
          "</span></button>"
        );
      }).join("") +
      "</div>";

    const content =
      question("Step 1", "What are you shopping for?", "Pick as many as apply — this helps Scout know where to start looking.") +
      grid +
      '<input id="input-want" value="' +
      escapeAttr(state.form.want) +
      '" placeholder="Anything specific? e.g. a study desk, a certain phone model… (optional)" class="w-full rounded-2xl border border-[#D9E1DA] bg-white px-4 py-3 font-body text-[13.5px] text-[#16241F] mb-6" />';

    return (
      screenShell(1, null, content) +
      bottomNav(primaryButton("btn-next1", "Continue", { disabled: state.form.categories.length === 0 }))
    );
  }

  function q2Screen() {
    const chips =
      '<div class="flex flex-col gap-2 mb-4">' +
      BUDGETS.map((b) => {
        const selected = state.form.budget === b;
        return (
          '<button data-budget="' +
          escapeAttr(b) +
          '" class="budget-btn font-body text-[13.5px] px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150 ' +
          (selected ? "bg-[#1F4D3E] border-[#1F4D3E] text-[#F4EFD8]" : "bg-white border-[#D9E1DA] text-[#16241F]") +
          '">' +
          b +
          "</button>"
        );
      }).join("") +
      "</div>";

    const content =
      question("Step 2", "What's your budget?", "A rough range is fine — nothing is locked in.") +
      chips +
      trustNote(true);

    return (
      screenShell(2, "btn-back2", content) +
      bottomNav(primaryButton("btn-next2", "Continue", { disabled: !state.form.budget }))
    );
  }

  function q3Screen() {
    function field(id, iconName, placeholder, value) {
      return (
        '<div class="relative">' +
        icon(iconName, "w-4 h-4 text-[#9AA6A0] absolute left-3.5 top-1/2 -translate-y-1/2") +
        '<input id="' +
        id +
        '" value="' +
        escapeAttr(value) +
        '" placeholder="' +
        placeholder +
        '" class="w-full rounded-2xl border border-[#D9E1DA] bg-white pl-10 pr-4 py-3 font-body text-[14px] text-[#16241F]" />' +
        "</div>"
      );
    }

    const content =
      question("Last step", "Where should Scout send this?", "So we can reach you the moment it's found.") +
      '<div class="flex flex-col gap-3 mb-4">' +
      field("input-name", "user", "Your name", state.form.name) +
      field("input-phone", "phone", "Phone number, e.g. 097X XXX XXX", state.form.phone) +
      field("input-area", "mapPin", "Area, e.g. Matero, Lusaka (optional)", state.form.area) +
      "</div>" +
      trustNote(false);

    const canSubmit = state.form.name && state.form.phone && !state.saving;

    return (
      screenShell(3, "btn-back3", content) +
      bottomNav(
        primaryButton("btn-submit", state.saving ? "Sending…" : "Send to Scout", {
          disabled: !canSubmit,
          icon: "send",
          spinning: state.saving,
        })
      )
    );
  }

  function completeScreen() {
    const catLabels = CATEGORIES.filter((c) => state.form.categories.indexOf(c.id) !== -1)
      .map((c) => c.label)
      .join(", ");

    function row(label, value) {
      return (
        '<div class="flex items-start justify-between gap-3">' +
        '<span class="font-body text-[12px] text-[#9AA6A0] shrink-0">' + label + "</span>" +
        '<span class="font-body text-[13px] text-[#16241F] text-right leading-snug">' + (value || "—") + "</span></div>"
      );
    }

    return (
      '<div class="h-full flex flex-col px-6 py-8 overflow-y-auto">' +
      '<div class="tear-anim">' +
      '<div class="flex items-center gap-2 mb-6">' +
      scoutBadge({ pulse: false, ping: true }) +
      '<span class="font-display italic text-[15px] text-[#1F4D3E]">Scout</span></div>' +
      '<p class="font-mono text-[11px] tracking-wider text-[#E8A23D] uppercase mb-2">Request logged</p>' +
      '<h2 class="font-display text-[26px] leading-tight text-[#16241F] mb-2">Scout is on the hunt.</h2>' +
      '<p class="font-body text-[13.5px] text-[#6B7A73] mb-6 leading-snug">You\'re among the first people helping us build a smarter way to shop. We\'ll reach out the moment we find a match.</p>' +
      '<div class="bg-white rounded-t-2xl border border-[#D9E1DA] px-5 pt-5 pb-6 relative">' +
      '<p class="font-mono text-[10px] tracking-widest text-[#9AA6A0] uppercase mb-3">Search ticket</p>' +
      '<div class="flex flex-col gap-2.5 mb-4">' +
      row("Looking for", catLabels) +
      (state.form.want ? row("Details", state.form.want) : "") +
      row("Budget", state.form.budget) +
      row("For", state.form.name) +
      "</div>" +
      '<div class="border-t border-dashed border-[#D9E1DA] pt-3 flex items-center justify-between">' +
      '<span class="font-mono text-[11px] text-[#9AA6A0]">DUE TODAY</span>' +
      '<span class="font-display text-[18px] text-[#1F4D3E]">K0.00</span></div></div>' +
      '<div class="h-3 receipt-edge -mt-px"></div>' +
      (state.saveError
        ? '<p class="font-body text-[11.5px] text-[#8B3A62] mt-4 text-center">We couldn\'t sync this one to our servers just now, but your request has been noted.</p>'
        : "") +
      "</div>" +
      '<div class="mt-auto pt-6 flex flex-col gap-2.5">' +
      '<a href="' +
      WHATSAPP_LINK +
      '" target="_blank" rel="noopener noreferrer" class="w-full font-body font-semibold text-[14px] rounded-2xl py-3.5 flex items-center justify-center gap-2 bg-[#25D366] text-white">' +
      icon("message", "w-4 h-4") +
      "Join our WhatsApp for updates</a>" +
      '<button id="btn-restart" class="w-full font-body font-semibold text-[14px] rounded-2xl py-3.5 border border-[#D9E1DA] text-[#16241F]">Start another search</button>' +
      "</div></div>"
    );
  }

  function insightsScreen() {
    const s = state.insights;
    let body;

    if (s.loading) {
      body = '<div class="flex-1 flex items-center justify-center py-10"><div class="spinner spinner-lg"></div></div>';
    } else if (s.error) {
      body =
        '<p class="font-body text-[13px] text-[#6B7A73]">Insights aren\'t connected yet — paste your Apps Script URL into config.js to see live numbers here.</p>';
    } else {
      const data = s.data;
      const visits = data.visits || 0;
      const interested = data.interested || 0;
      const total = data.total || 0;
      const interestRate = visits > 0 ? Math.round((interested / visits) * 100) : 0;
      const completeRate = interested > 0 ? Math.round((total / interested) * 100) : 0;
      const maxVal = Math.max(1, visits);

      function funnelRow(label, value, note) {
        return (
          '<div><div class="flex items-center justify-between mb-1">' +
          '<span class="font-body text-[12.5px] text-[#F4EFD8]/90">' + label + "</span>" +
          '<span class="font-display text-[17px] text-[#F4EFD8]">' + value + "</span></div>" +
          '<div class="h-1.5 rounded-full bg-[#F4EFD8]/15 overflow-hidden">' +
          '<div class="h-full rounded-full bg-[#E8A23D]" style="width:' + Math.min(100, (value / maxVal) * 100) + '%"></div></div>' +
          (note ? '<p class="font-mono text-[10px] text-[#F4EFD8]/50 mt-1">' + note + "</p>" : "") +
          "</div>"
        );
      }

      function statBlock(title, dataObj) {
        const entries = Object.entries(dataObj || {}).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) return "";
        const max = Math.max(1, ...entries.map((e) => e[1]));
        return (
          '<div><p class="font-body text-[12px] font-semibold text-[#16241F] mb-2.5">' + title + "</p>" +
          '<div class="flex flex-col gap-2">' +
          entries
            .map(
              ([key, count]) =>
                '<div class="flex items-center gap-3">' +
                '<span class="font-body text-[12px] text-[#6B7A73] w-[120px] shrink-0 truncate">' + key + "</span>" +
                '<div class="flex-1 h-2 rounded-full bg-[#EDF3EE] overflow-hidden">' +
                '<div class="h-full rounded-full bg-[#E8A23D]" style="width:' + (count / max) * 100 + '%"></div></div>' +
                '<span class="font-mono text-[11px] text-[#9AA6A0] w-4 text-right">' + count + "</span></div>"
            )
            .join("") +
          "</div></div>"
        );
      }

      const catNamed = {};
      Object.keys(data.catCounts || {}).forEach((id) => {
        const cat = CATEGORIES.find((c) => c.id === id);
        catNamed[cat ? cat.label : id] = data.catCounts[id];
      });

      body =
        '<div class="rounded-2xl bg-[#1F4D3E] px-5 py-4">' +
        '<p class="font-body text-[11.5px] text-[#F4EFD8]/70 mb-3">Interest funnel</p>' +
        '<div class="flex flex-col gap-3">' +
        funnelRow("Visited the app", visits, null) +
        funnelRow("Interested — tapped the button", interested, interestRate + "% of visits") +
        funnelRow("Completed a request", total, completeRate + "% of interested") +
        "</div></div>" +
        (total === 0
          ? '<p class="font-body text-[13px] text-[#6B7A73] mt-6">No completed requests yet — the funnel above already tracks visits and taps.</p>'
          : '<div class="flex flex-col gap-6 mt-6">' + statBlock("Most requested categories", catNamed) + statBlock("Budget distribution", data.budgetCounts) + "</div>");
    }

    return (
      '<div class="h-full flex flex-col px-6 py-7 overflow-y-auto">' +
      '<div class="flex items-center justify-between mb-6">' +
      '<div><p class="font-mono text-[11px] tracking-wider text-[#E8A23D] uppercase mb-1">Live from your Sheet</p>' +
      '<h2 class="font-display text-[22px] text-[#16241F]">Demand insights</h2></div>' +
      '<button id="btn-close-insights" class="w-8 h-8 rounded-full bg-[#EDF3EE] flex items-center justify-center text-[#6B7A73]">' +
      icon("x", "w-4 h-4") +
      "</button></div>" +
      body +
      "</div>"
    );
  }

  // ---------------------------------------------------------------------
  // Render + event binding
  // ---------------------------------------------------------------------

  function escapeAttr(str) {
    return String(str || "").replace(/"/g, "&quot;");
  }

  function render() {
    let inner;
    switch (state.screen) {
      case "landing":
        inner = landingScreen();
        break;
      case "q1":
        inner = q1Screen();
        break;
      case "q2":
        inner = q2Screen();
        break;
      case "q3":
        inner = q3Screen();
        break;
      case "complete":
        inner = completeScreen();
        break;
      case "insights":
        inner = insightsScreen();
        break;
      default:
        inner = landingScreen();
    }

    document.getElementById("phone-frame").innerHTML = inner;
    bindEvents();
  }

  function goTo(screen) {
    state.screen = screen;
    render();
  }

  function bindEvents() {
    const $ = (id) => document.getElementById(id);

    if ($("btn-start")) {
      $("btn-start").addEventListener("click", () => {
        if (!state.loggedInterest) {
          state.loggedInterest = true;
          post("interest");
        }
        goTo("q1");
      });
    }
    if ($("btn-insights")) {
      $("btn-insights").addEventListener("click", () => {
        goTo("insights");
        loadInsights();
      });
    }
    if ($("btn-close-insights")) {
      $("btn-close-insights").addEventListener("click", () => goTo("landing"));
    }

    // q1
    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-cat");
        const idx = state.form.categories.indexOf(id);
        if (idx === -1) state.form.categories.push(id);
        else state.form.categories.splice(idx, 1);
        render();
      });
    });
    if ($("input-want")) {
      $("input-want").addEventListener("input", (e) => {
        state.form.want = e.target.value;
      });
    }
    if ($("btn-next1")) {
      $("btn-next1").addEventListener("click", () => {
        if (state.form.categories.length === 0) return;
        goTo("q2");
      });
    }

    // q2
    document.querySelectorAll(".budget-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.form.budget = btn.getAttribute("data-budget");
        render();
      });
    });
    if ($("btn-back2")) $("btn-back2").addEventListener("click", () => goTo("q1"));
    if ($("btn-next2")) {
      $("btn-next2").addEventListener("click", () => {
        if (!state.form.budget) return;
        goTo("q3");
      });
    }

    // q3
    if ($("btn-back3")) $("btn-back3").addEventListener("click", () => goTo("q2"));
    ["input-name", "input-phone", "input-area"].forEach((id) => {
      if ($(id)) {
        $(id).addEventListener("input", (e) => {
          const key = id.replace("input-", "");
          state.form[key] = e.target.value;
          updateSubmitButtonState();
        });
      }
    });
    if ($("btn-submit")) {
      $("btn-submit").addEventListener("click", submit);
    }

    // complete
    if ($("btn-restart")) {
      $("btn-restart").addEventListener("click", () => {
        state.form = { categories: [], want: "", budget: "", name: "", phone: "", area: "" };
        state.loggedInterest = false;
        goTo("landing");
      });
    }
  }

  function submit() {
    if (!state.form.name || !state.form.phone) return;
    state.saving = true;
    render();
    post("submission", state.form).finally(() => {
      state.saving = false;
      goTo("complete");
    });
  }

  // Flips the Send-to-Scout button between enabled/disabled as the person
  // types, without re-rendering the whole screen (which would lose their
  // cursor position mid-keystroke).
  function updateSubmitButtonState() {
    const btn = document.getElementById("btn-submit");
    if (!btn) return;
    const canSubmit = state.form.name && state.form.phone && !state.saving;
    btn.disabled = !canSubmit;
    if (canSubmit) {
      btn.classList.remove("bg-[#D9E1DA]", "text-[#9AA6A0]", "cursor-not-allowed");
      btn.classList.add(
        "bg-[#E8A23D]",
        "text-[#16241F]",
        "hover:bg-[#DE9527]",
        "active:scale-[0.98]",
        "shadow-[0_4px_14px_rgba(232,162,61,0.35)]"
      );
    } else {
      btn.classList.add("bg-[#D9E1DA]", "text-[#9AA6A0]", "cursor-not-allowed");
      btn.classList.remove(
        "bg-[#E8A23D]",
        "text-[#16241F]",
        "hover:bg-[#DE9527]",
        "active:scale-[0.98]",
        "shadow-[0_4px_14px_rgba(232,162,61,0.35)]"
      );
    }
  }

  function loadInsights() {
    state.insights = { loading: true, error: false, data: null };
    render();
    fetchStats()
      .then((data) => {
        state.insights = { loading: false, error: false, data: data };
        if (state.screen === "insights") render();
      })
      .catch(() => {
        state.insights = { loading: false, error: true, data: null };
        if (state.screen === "insights") render();
      });
  }

  // ---------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------

  function boot() {
    render();
    post("visit");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
