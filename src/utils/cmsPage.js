import { fetchCmsCurrentUser } from "../services/site.js";
import { showCmsToast } from "./cmsToast.js";

export function redirectToCmsLogin() {
  window.history.replaceState({}, "", "/cms/login");
  window.dispatchEvent(new PopStateEvent("popstate"));
}
export async function loadCmsPageContent(fetchContent) {
  try {
    const [authResponse, contentResponse] = await Promise.all([fetchCmsCurrentUser(), fetchContent()]);

    return {
      user: authResponse.data?.user || {},
      ...contentResponse.data
    };
  } catch {
    redirectToCmsLogin();
    throw new Error("Redirecting to login...");
  }
}

export function notifyCmsStatus(message, isError = false, options = {}) {
  const text = String(message || "").trim();

  if (!text) {
    return;
  }

  const shouldToast = typeof options.toast === "boolean" ? options.toast : isError || !text.endsWith("...");

  if (!shouldToast) {
    return;
  }

  showCmsToast(text, { type: isError ? "error" : "success" });
}
