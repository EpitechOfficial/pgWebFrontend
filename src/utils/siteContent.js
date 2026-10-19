export function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function removeEditorFooter(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/<p data-f-id="pbf"[^>]*>.*?<\/p>/gsi, "").trim();
}

export function resolveImage(value, folder = "image", fallback = "academick.jpg") {
  if (!value) {
    return `/${folder}/${fallback}`;
  }

  const raw = String(value).trim();

  if (!raw) {
    return `/${folder}/${fallback}`;
  }

  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:")) {
    return raw;
  }

  const normalized = raw.replace(/^(\.\.\/|\.\/|\/)+/, "");

  if (/^(image|img)\//i.test(normalized)) {
    return `/${normalized}`;
  }

  return `/${folder}/${normalized}`;
}
