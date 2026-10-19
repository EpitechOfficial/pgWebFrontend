// External Links API
export async function fetchExternalLinks() {
  const res = await getJson("/api-external-links.php");
  if (res.status !== 'ok') throw new Error(res.message || "Failed to fetch external links");
  return res.data || {}; 
}

export async function updateExternalLinks(links) {
await postJson("/api-external-links.php", links);
  // if (!res.ok) throw new Error("Failed to update external links");
  // return await res.json();
}
// Sectional Heads (file-based CMS)
export async function fetchSectionalHeads() {
  const res = await getJson("/api-sectional-heads.php");
  return res.data || [];
}

export async function updateSectionalHeads(heads) {
  return postJson("/api-sectional-heads.php", heads);
}
async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function resolveApiUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getJson(path) {
  const response = await fetch(resolveApiUrl(path), {
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });

  return parseResponse(response);
}

export async function postJson(path, body = {}) {
  const response = await fetch(resolveApiUrl(path), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return parseResponse(response);
}

export async function postFormData(path, body) {
  const response = await fetch(resolveApiUrl(path), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json"
    },
    body
  });

  return parseResponse(response);
}
