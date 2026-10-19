import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchExternalLinks } from "../services/api.js";
import { fetchContactContent } from "../services/site.js";

const legacyLinks = {
  programs: "/programmes",
  internationalStudents: "/foreign-student",
  forms: "/forms",
  feeSchedule: "/setup_fee",
  internationalFeeSchedule: "/intl_fee"
};

function navigationGroup(path) {
  if (path === "/") return "home";
  if (["/academics", "/admissions", "/fees", "/why", "/areas", "/programmes", "/foreign-student", "/program", "/masterprogram", "/postgraduateprogram", "/azprograms", "/interstd", "/academic"].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return "academics";
  if (["/form", "/forms"].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return "forms";
  if (["/setup_fee", "/intl_fee"].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return "payments";
  if (path === "/contact" || path.startsWith("/contact/")) return "contact";
  if (["/about", "/head"].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return "about";
  return "";
}

function ContactLink({ type, value, footer = false, pending = false, children }) {
  const key = `${footer ? "footer-" : ""}${type}`;
  const href = value ? `${type === "phone" ? "tel" : "mailto"}:${value}` : "#";
  const fallback = type === "phone" ? "Loading contact" : "Loading email";
  return <a href={href} data-contact-link={key}>{children}<span data-contact-text={key}> {value || (pending ? fallback : "Not available")}</span></a>;
}

function SocialLinks({ contact, footer = false }) {
  const size = footer ? 50 : 15;
  const prefix = footer ? "footer-" : "";
  return (
    <div className={`social ${footer ? "mr" : "mb-3"}`}>
      <a href={contact.facebook || "#"} target="_blank" rel="noreferrer" className="socialMediaLinks" data-social-link={`${prefix}facebook`} aria-label="Facebook">
        <img className="lazy mr-2" src="/img/facebook.png" width={size} height={size} alt="Facebook page for The University of Ibadan" />
      </a>
      <a href={contact.twitter || "#"} target="_blank" rel="noreferrer" className="socialMediaLinks" data-social-link={`${prefix}twitter`} aria-label="Twitter">
        <img className="lazy mr-2" src="/img/twitter.png" width={size} height={size} alt="Twitter page for The University of Ibadan" />
      </a>
      <a href={contact.instagram || "#"} target="_blank" rel="noreferrer" className="socialMediaLinks" data-social-link={`${prefix}instagram`} aria-label="Instagram">
        <img className="lazy" src="/img/insta2.png" width={size} height={size} alt="Instagram page for The University of Ibadan" />
      </a>
    </div>
  );
}

function MobileMenu({ links, currentGroup, open, onClose }) {
  const [openSubmenu, setOpenSubmenu] = useState("");
  const toggle = (event, name) => {
    event.preventDefault();
    setOpenSubmenu((current) => current === name ? "" : name);
  };
  const itemClass = (name) => `mobile-item${openSubmenu === name ? " mobile-item--open" : ""}`;

  useEffect(() => {
    if (!open) setOpenSubmenu("");
  }, [open]);

  return (
    <div className={`${open ? "" : "hidden "}mobile-menu`} id="mobile-navigation" data-mobile-menu>
      <ul onClick={(event) => { if (event.target.closest("a") && !event.target.closest("[data-mobile-parent]")) onClose(); }}>
        <li><a className={`mobile-bg block text-sm px-2 py-4 font-semibold${currentGroup === "home" ? " mobile-menu__current" : ""}`} href="/" data-link data-nav-group="home"><i className="fas fa-home"></i></a></li>
        <li className={itemClass("academics")} data-mobile-item>
          <a className={`mobile-colour mobile-parent block text-sm px-2 py-4${currentGroup === "academics" ? " mobile-menu__current" : ""}`} href="#" onClick={(event) => toggle(event, "academics")} data-mobile-parent="academics-submenu" data-nav-group="academics">Academics</a>
          <ul className="mobile-submenu" id="academics-submenu" data-mobile-submenu>
            <li><a href="/academics" data-link>Academics Home</a></li><li><a href="/why" data-link>Why UI Postgraduate College</a></li><li><a href="/areas" data-link>Research Areas</a></li><li><a href={legacyLinks.programs} data-link>Programmes</a></li><li><a href="/fees" data-link>Fees &amp; Funding</a></li><li><a href="/admissions" data-link>Admissions</a></li>
          </ul>
        </li>
        <li className={itemClass("eportal")} data-mobile-item>
          <a className="mobile-colour mobile-parent block text-sm px-2 py-4" href="#" onClick={(event) => toggle(event, "eportal")} data-mobile-parent="eportal-submenu">E-Portal</a>
          <ul className="mobile-submenu" id="eportal-submenu" data-mobile-submenu><li><a href={links.admissions || "#"} target="_blank" rel="noreferrer">Admissions / Application</a></li><li><a href={links.studentPortal || "#"} target="_blank" rel="noreferrer">Student Portal</a></li></ul>
        </li>
        <li><a className={`mobile-colour block text-sm px-2 py-4${currentGroup === "academics" ? " mobile-menu__current" : ""}`} href={legacyLinks.internationalStudents} data-link data-nav-group="academics">International Students</a></li>
        <li><a className={`mobile-colour block text-sm px-2 py-4${currentGroup === "forms" ? " mobile-menu__current" : ""}`} href={legacyLinks.forms} data-link data-nav-group="forms">Forms</a></li>
        <li className={itemClass("publications")} data-mobile-item>
          <a className="mobile-colour mobile-parent block text-sm px-2 py-4" href="#" onClick={(event) => toggle(event, "publications")} data-mobile-parent="publications-submenu">Publications</a>
          <ul className="mobile-submenu" id="publications-submenu" data-mobile-submenu><li><a href={links.repository || "#"} target="_blank" rel="noreferrer">Repository</a></li><li><a href="#">Compedium of Abstract</a></li><li><a href={links.studentHandbook || "#"} target="_blank" rel="noreferrer">Student Handbook</a></li><li><a href={links.uiStyle || "#"} target="_blank" rel="noreferrer">UI manual of writing style</a></li></ul>
        </li>
        <li className={itemClass("payments")} data-mobile-item>
          <a className={`mobile-colour mobile-parent block text-sm px-2 py-4${currentGroup === "payments" ? " mobile-menu__current" : ""}`} href="#" onClick={(event) => toggle(event, "payments")} data-mobile-parent="payments-submenu" data-nav-group="payments">Payments</a>
          <ul className="mobile-submenu" id="payments-submenu" data-mobile-submenu><li><a href={legacyLinks.feeSchedule} target="_blank" rel="noreferrer">Fee Schedule</a></li><li><a href={legacyLinks.internationalFeeSchedule} target="_blank" rel="noreferrer">Fee Schedule (International Student)</a></li><li><a href={links.sundryPayment || "#"} target="_blank" rel="noreferrer">Sundry Payment</a></li></ul>
        </li>
        <li><a className={`mobile-colour block text-sm px-2 py-4${currentGroup === "contact" ? " mobile-menu__current" : ""}`} href="/contact" data-link data-nav-group="contact">Contact Us</a></li>
        <li className={itemClass("about")} data-mobile-item>
          <a className={`mobile-colour mobile-parent block text-sm px-2 py-4${currentGroup === "about" ? " mobile-menu__current" : ""}`} href="#" onClick={(event) => toggle(event, "about")} data-mobile-parent="about-submenu" data-nav-group="about">About Us</a>
          <ul className="mobile-submenu" id="about-submenu" data-mobile-submenu><li><a href="/about" data-link>The Postgraduate College</a></li><li><a href="/head" data-link>Sectional Heads</a></li></ul>
        </li>
      </ul>
    </div>
  );
}

function DesktopNavigation({ links, currentGroup }) {
  const [openPanel, setOpenPanel] = useState("");
  const hideTimer = useRef();
  const clearClose = () => window.clearTimeout(hideTimer.current);
  const scheduleClose = () => { clearClose(); hideTimer.current = window.setTimeout(() => setOpenPanel(""), 120); };
  const trigger = (id) => ({ onMouseEnter: () => { clearClose(); setOpenPanel(id); }, onFocus: () => { clearClose(); setOpenPanel(id); }, onClick: (event) => { event.preventDefault(); setOpenPanel((current) => current === id ? "" : id); } });
  const buttonClass = (group) => `tablinks${currentGroup === group ? " on" : ""}`;
  const panelProps = (id) => ({ style: { display: openPanel === id ? "block" : "none" }, onMouseEnter: clearClose, onMouseLeave: scheduleClose });

  useEffect(() => {
    const closeOutside = (event) => { if (!event.target.closest("[data-shell-nav]")) setOpenPanel(""); };
    const closeOnEscape = (event) => { if (event.key === "Escape") setOpenPanel(""); };
    document.addEventListener("click", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { clearClose(); document.removeEventListener("click", closeOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  return <div style={{ display: "contents" }} onMouseEnter={clearClose} onMouseLeave={scheduleClose}>
    <div className="tab" aria-label="Primary navigation" onMouseEnter={clearClose} onMouseLeave={scheduleClose}>
      <button className={`${buttonClass("home")} no`} data-nav-group="home"><a href="/" data-link aria-label="Home"><i className="fas fa-home"></i></a></button>
      <button className={buttonClass("academics")} {...trigger("Paris")} data-dropdown-target="Paris" data-nav-group="academics"><a href="/academics" data-link>Academics</a></button>
      <button className={buttonClass("eportal")} {...trigger("Eportal")} data-dropdown-target="Eportal" data-nav-group="eportal"><a href="#">E-Portal</a></button>
      <button className={buttonClass("doctoral")} data-nav-group="doctoral"><a href="#">Doctoral Academy</a></button>
      <button className={buttonClass("publications")} {...trigger("forms")} data-dropdown-target="forms" data-nav-group="publications"><a href="#">Publications</a></button>
      <button className={buttonClass("forms")} data-nav-group="forms"><a href={legacyLinks.forms} data-link>Forms</a></button>
      <button className={buttonClass("ecampus")} data-nav-group="ecampus"><a href={links.eCampus || "#"}>E-Campus</a></button>
      <button className={buttonClass("payments")} {...trigger("Pay")} data-dropdown-target="Pay" data-nav-group="payments"><a href="#">Payments</a></button>
      <button className={buttonClass("contact")} data-nav-group="contact"><a href="/contact" data-link>Contact Us</a></button>
      <button className={buttonClass("about")} {...trigger("about")} data-dropdown-target="about" data-nav-group="about"><a href="#">About Us</a></button>
    </div>
    <div id="Paris" className="tabcontent" data-dropdown-panel {...panelProps("Paris")}><div className="container"><div className="tab-menu"><ul><li><a href="/why" data-link>Why UI Postgraduate College</a></li><li><a href="/contact" data-link>Contact Us</a></li></ul><ul><li><a href="/areas" data-link>Research Areas</a></li><li><a href="/fees" data-link>Fees &amp; Funding</a></li></ul><ul><li><a href={legacyLinks.programs} data-link>Programmes</a></li><li><a href="/admissions" data-link>Admissions</a></li></ul><ul><li><a href={legacyLinks.internationalStudents} data-link>International Students</a></li></ul></div></div></div>
    <div id="forms" className="tabcontent" data-dropdown-panel {...panelProps("forms")}><div className="container"><div className="tab-menu"><ul><li><a href={links.repository || "#"} target="_blank" rel="noreferrer">Repository</a></li><li><a href="#">Compedium of Abstract</a></li></ul><ul><li><a href={links.studentHandbook || "#"} target="_blank" rel="noreferrer">Student Handbook</a></li><li><a href={links.uiStyle || "#"} target="_blank" rel="noreferrer">UI manual of writing style</a></li></ul></div></div></div>
    <div id="Eportal" className="tabcontent" data-dropdown-panel {...panelProps("Eportal")}><div className="containerr"><div className="tab-menu"><ul><li><a href={links.admissions || "#"} target="_blank" rel="noreferrer">Admissions / Application</a></li><li><a href={links.studentPortal || "#"} target="_blank" rel="noreferrer">Student Portal</a></li></ul></div></div></div>
    <div id="Pay" className="tabcontent" data-dropdown-panel {...panelProps("Pay")}><div className="container"><div className="tab-menu"><ul><li><a href={legacyLinks.feeSchedule} target="_blank" rel="noreferrer">Fee Schedule</a></li></ul><ul><li><a href={legacyLinks.internationalFeeSchedule} target="_blank" rel="noreferrer">Fee Schedule (International Student)</a></li></ul><ul><li><a href={links.sundryPayment || "#"} target="_blank" rel="noreferrer">Sundry Payment</a></li></ul></div></div></div>
    <div id="about" className="tabcontent" data-dropdown-panel {...panelProps("about")}><div className="containerr"><div className="tab-menu"><ul><li><a href="/about" data-link>The Postgraduate College</a></li><li><a href="/head" data-link>Sectional Heads</a></li></ul></div></div></div>
  </div>;
}

function Footer({ contact }) {
  const details = contact || {};
  return <footer id="main-footer" className="legacy-footer bg-dark"><div className="footer mb-3"><div className="contact-us"><h1>Contact us</h1><div className="mb-3"><ContactLink type="phone" value={details.phone} pending={!contact} footer><i className="fas fa-phone"></i></ContactLink><span className="reach-note">(9AM - 4PM)</span></div><div className="mb-3"><ContactLink type="email" value={details.email} pending={!contact} footer><i className="fas fa-envelope"></i></ContactLink></div><div className="mb-3"><ContactLink type="email2" value={details.email2} pending={!contact} footer><i className="fas fa-envelope"></i></ContactLink></div></div><div className="location"><h1>Locate us</h1><div><a href="https://goo.gl/maps/8nPbQPcZMRBui2mr5" target="_blank" rel="noreferrer">The Postgraduate College,<br /> University of Ibadan, <br />Ibadan, <br />Nigeria.</a></div></div><div className="social"><h1>Social media</h1><SocialLinks contact={details} footer /></div></div><hr /><p>Copyright &copy;{new Date().getFullYear()}, Postgraduate College, All Rights Reserved</p></footer>;
}

export default function AppShell({ onOutlet }) {
  const location = useLocation();
  const [links, setLinks] = useState(null);
  const [contact, setContact] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const currentGroup = navigationGroup(location.pathname);
  const minimal = location.pathname === "/setup_fee/result" || location.pathname === "/intl_fee/result" || location.pathname === "/cms/login" || location.pathname === "/cms" || location.pathname.startsWith("/cms/");

  useEffect(() => { void fetchExternalLinks().then(setLinks).catch(() => setLinks({})); void fetchContactContent().then((payload) => setContact(payload.data?.contact || {})).catch(() => setContact({})); }, []);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const closeOutside = (event) => { if (!navRef.current?.contains(event.target)) setMobileOpen(false); };
    const closeWide = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    document.addEventListener("click", closeOutside); window.addEventListener("resize", closeWide);
    return () => { document.removeEventListener("click", closeOutside); window.removeEventListener("resize", closeWide); };
  }, []);

  if (!links) return null;
  const details = contact || {};

  return <div className={`legacy-shell${minimal ? " legacy-shell--minimal" : ""}`}>
    <nav id="navbars" data-shell-nav ref={navRef}>
      <div id="nav1"><div className="top-logo"><a className="legacy-brand" href="/" data-link><img src="/image/logo.png" className="logo" alt="The Postgraduate College logo" /><h1>The Postgraduate College</h1></a></div><div className="social-nav"><SocialLinks contact={details} /><div className="reach"><ContactLink type="phone" value={details.phone} pending={!contact}><i className="fas fa-phone"></i></ContactLink><span className="reach-note">(9AM - 4PM)</span></div><div className="reach"><ContactLink type="email" value={details.email} pending={!contact}><i className="fas fa-envelope"></i></ContactLink></div><div className="reach"><ContactLink type="email2" value={details.email2} pending={!contact}><i className="fas fa-envelope"></i></ContactLink></div></div><div className="shell-mobile-toggle"><button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((open) => !open)}><span></span><span></span><span></span></button></div></div>
      <MobileMenu links={links} currentGroup={currentGroup} open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <DesktopNavigation links={links} currentGroup={currentGroup} />
    </nav>
    <div className="left-line"><main className="spa-shell-main" data-router-view ref={onOutlet}></main></div>
    <Footer contact={contact} />
  </div>;
}
