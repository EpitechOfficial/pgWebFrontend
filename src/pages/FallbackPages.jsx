import { LegacyContentPanel } from "../components/LegacyPageLayout.jsx";

export async function loadFallbackPage() { return null; }

export function NotFoundPage() {
  return <div className="not-found-page" data-not-found-page><section id="doc" className="not-found-page__doc"><div className="container"><LegacyContentPanel pageClass="not-found-page__content-card"><div className="not-found-page__content"><h1 className="not-found-page__title">404</h1><p className="not-found-page__eyebrow">Page Not Found</p><h2>The link may be broken or the page may have moved.</h2><p>Try returning to the homepage or continue to a main section of the website.</p><div className="not-found-page__actions"><a href="/" data-link className="not-found-page__button not-found-page__button--primary">Go Home</a><a href="/academics" data-link className="not-found-page__button">Academics</a><a href="/contact" data-link className="not-found-page__button">Contact</a></div></div></LegacyContentPanel></div></section></div>;
}

export function NetworkErrorPage() {
  return <div className="network-error__hero" data-network-error-page><section id="doc" className="network-error__doc"><div className="container"><LegacyContentPanel pageClass="network-error__content-card"><div className="network-error__content"><h1 className="network-error__title">Network Error</h1><p className="network-error__eyebrow">Unable to load page</p><h2>It looks like you are offline or there was a problem connecting to the server.</h2><p>Please check your internet connection and try again.</p><div className="network-error__actions"><a href="/" data-link className="network-error__button network-error__button--primary">Go Home</a><button type="button" onClick={() => window.location.reload()} className="network-error__button">Retry</button></div></div></LegacyContentPanel></div></section></div>;
}
