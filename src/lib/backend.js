const ENDPOINT = "/.netlify/functions/scout";

export function post(type, extra, sessionId) {
  const payload = { type, sessionId, ...extra };
  return fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((r) => r.json())
    .catch(() => ({ ok: false }));
}

export function fetchStats() {
  return fetch(`${ENDPOINT}?action=stats`).then((r) => r.json());
}

export function createCircle({ name, creatorName, creatorPhone }) {
  const params = new URLSearchParams({
    action: "create_circle",
    name: name || "",
    creatorName: creatorName || "",
    creatorPhone: creatorPhone || "",
  });
  return fetch(`${ENDPOINT}?${params.toString()}`).then((r) => r.json());
}

export function fetchCircle(code) {
  const params = new URLSearchParams({ action: "circle", code: code || "" });
  return fetch(`${ENDPOINT}?${params.toString()}`).then((r) => r.json());
}

export function circleShareUrl(code) {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?circle=${code}`;
}

export function getWhatsAppLink() {
  const { WHATSAPP_GROUP_LINK } = window.SCOUT_CONFIG || {};
  return WHATSAPP_GROUP_LINK || "#";
}
