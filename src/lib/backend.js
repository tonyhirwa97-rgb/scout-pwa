function getConfig() {
  return window.SCOUT_CONFIG || {};
}

function isConfigured(url) {
  return url && url.indexOf("PASTE_YOUR") !== 0;
}

export function post(type, extra, sessionId) {
  const { SCRIPT_URL } = getConfig();
  if (!isConfigured(SCRIPT_URL)) return Promise.resolve();
  const payload = { type, sessionId, ...extra };
  return fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export function fetchStats() {
  const { SCRIPT_URL } = getConfig();
  if (!isConfigured(SCRIPT_URL)) {
    return Promise.reject(new Error("not configured"));
  }
  return fetch(`${SCRIPT_URL}?action=stats`).then((r) => r.json());
}

export function getWhatsAppLink() {
  const { WHATSAPP_GROUP_LINK } = getConfig();
  return WHATSAPP_GROUP_LINK || "#";
}
