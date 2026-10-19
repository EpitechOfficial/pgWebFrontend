import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { debugMode } from "../app.js";
import { adminRoutes } from "./adminRoutes.js";
import { publicRoutes } from "./publicRoutes.js";

const routes = {
  ...publicRoutes,
  ...adminRoutes
};

let loaderOverlay;

function getRoute(pathname) {
  return routes[pathname] || publicRoutes.__notFound;
}

function ensureLoaderOverlay() {
  if (loaderOverlay?.isConnected) {
    return loaderOverlay;
  }

  loaderOverlay = document.createElement("div");
  loaderOverlay.className = "pgc-loader-overlay";
  loaderOverlay.setAttribute("aria-hidden", "true");
  loaderOverlay.innerHTML = `
    <div class="pgc-loader-overlay__backdrop"></div>
    <div class="pgc-loader-overlay__center">
      <div class="pgc-loader__seal">
        <span class="pgc-loader__ring pgc-loader__ring--outer"></span>
        <span class="pgc-loader__ring pgc-loader__ring--inner"></span>
        <img src="/image/logo.png" alt="The Postgraduate College logo" class="pgc-loader__logo" />
        <span class="pgc-loader__shine"></span>
      </div>
    </div>
  `;
  document.body.appendChild(loaderOverlay);

  return loaderOverlay;
}

function showLoaderOverlay() {
  ensureLoaderOverlay().classList.add("is-visible");
  document.body.classList.add("pgc-loader-overlay-open");
}

function hideLoaderOverlay() {
  loaderOverlay?.classList.remove("is-visible");
  document.body.classList.remove("pgc-loader-overlay-open");
}

export default function LegacyRoute({ outlet }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [nativePage, setNativePage] = useState(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const link = event.target.closest("[data-link]");

      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const href = link.getAttribute("href") || "/";
      const destination = new URL(href, window.location.href);

      if (destination.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      navigate(`${destination.pathname}${destination.search}${destination.hash}`);
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [navigate]);

  useEffect(() => {
    let isCurrent = true;
    let hideTimer;
    const route = getRoute(location.pathname);

    setNativePage(null);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.title = route.title;
    outlet.classList.remove("route-ready");
    showLoaderOverlay();

    void route
      .load()
      .then((model) => {
        if (!isCurrent) {
          return;
        }

        outlet.innerHTML = "";
        setNativePage({ Component: route.component, model, key: `${location.pathname}${location.search}${location.key}` });
        outlet.classList.add("route-ready");
      })
      .catch((error) => {
        if (!isCurrent || error?.message === "Redirecting to login...") {
          return;
        }

        if (!debugMode) {
          const networkErrorRoute = publicRoutes.__networkError;
          document.title = networkErrorRoute.title;
          outlet.innerHTML = "";
          setNativePage({ Component: networkErrorRoute.component, model: null, key: `network-error-${location.pathname}${location.search}` });
        } else {
          const message = String(error?.message || "Unknown error");
          const stack = String(error?.stack || "");
          outlet.innerHTML = `<section class="panel loading-state"><p class="section-label">Error</p><h2>${message}</h2><pre>${stack}</pre></section>`;
        }

        outlet.classList.add("route-ready");
      })
      .finally(() => {
        if (isCurrent) {
          hideTimer = window.setTimeout(hideLoaderOverlay, 140);
        }
      });

    return () => {
      isCurrent = false;
      window.clearTimeout(hideTimer);
    };
  }, [location.pathname, location.search, location.key, outlet]);

  useEffect(() => {
    return () => {
      hideLoaderOverlay();
      loaderOverlay?.remove();
      loaderOverlay = undefined;
    };
  }, []);

  return nativePage ? createPortal(<nativePage.Component key={nativePage.key} model={nativePage.model} />, outlet) : null;
}
