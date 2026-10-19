let toastContainer = null;

function ensureToastContainer() {
  if (toastContainer && document.body.contains(toastContainer)) {
    return toastContainer;
  }

  toastContainer = document.querySelector("[data-cms-toast-stack]");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "cms-toast-stack";
    toastContainer.setAttribute("data-cms-toast-stack", "");
    document.body.appendChild(toastContainer);
  }

  return toastContainer;
}

export function showCmsToast(message, { type = "success", duration = 4200 } = {}) {
  const text = String(message || "").trim();

  if (!text) {
    return;
  }

  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = `cms-toast cms-toast--${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `
    <span class="cms-toast__icon" aria-hidden="true">
      <i class="fas ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
    </span>
    <span class="cms-toast__message"></span>
    <button type="button" class="cms-toast__close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `;

  toast.querySelector(".cms-toast__message").textContent = text;

  let removed = false;

  const removeToast = () => {
    if (removed) {
      return;
    }

    removed = true;
    toast.classList.remove("is-visible");
    toast.classList.add("is-hiding");

    window.setTimeout(() => {
      toast.remove();
      if (toastContainer && toastContainer.childElementCount === 0) {
        toastContainer.remove();
        toastContainer = null;
      }
    }, 220);
  };

  toast.querySelector(".cms-toast__close")?.addEventListener("click", removeToast);
  container.appendChild(toast);

  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  window.setTimeout(removeToast, duration);
}
