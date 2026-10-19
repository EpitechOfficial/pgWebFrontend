import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutCmsUser } from "../../services/site.js";
import { showCmsToast } from "../../utils/cmsToast.js";

const navItems = [
  { key: "dashboard", href: "/cms", icon: "fa-home", label: "Introduction" },
  { key: "home", icon: "fa-home", label: "Home Page", children: [{ key: "carousel", href: "/cms/home", label: "Carosel" }, { key: "flagship", href: "/cms/home/flagship", label: "Flagship Programmes" }, { key: "speech", href: "/cms/home/speech", label: "Provost's Speech" }] },
  { key: "sectional-heads", href: "/cms/sectional-heads", icon: "fa-users-cog", label: "Sectional Heads" },
  { key: "external-links", href: "/cms/external-links", icon: "fa-link", label: "External Links" },
  { key: "academics", icon: "fa-th-list", label: "Academics", children: [{ key: "academics-overview", href: "/cms/academics", label: "Overview" }, { key: "academics-programmes", href: "/cms/academics/programmes", label: "Programme" }, { key: "academics-facilities", href: "/cms/academics/facilities", label: "Facilities" }, { key: "academics-supervisors", href: "/cms/academics/supervisors", label: "Supervisor" }, { key: "academics-why", href: "/cms/academics/why", label: "Why" }, { key: "academics-students", href: "/cms/academics/students", label: "Student Speech" }, { key: "academics-fees", href: "/cms/academics/fees", label: "Fees & Fundings" }] },
  { key: "admissions", icon: "fa-th-list", label: "Admission", children: [{ key: "admissions-overview", href: "/cms/admissions", label: "Overview" }, { key: "admissions-guide", href: "/cms/admissions/guide", label: "Application Guide" }, { key: "admissions-after", href: "/cms/admissions/after", label: "After Application" }] },
  { key: "international", href: "/cms/international", icon: "fa-th-list", label: "International" },
  { key: "contact", href: "/cms/contact", icon: "fa-th-list", label: "Contact" }
];

export default function AdminShell({ activeKey = "dashboard", activeChildKey = "", heroTitle = "", heroLead = "", children }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => new Set([activeKey]));
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => { setOpenGroups((groups) => new Set([...groups, activeKey])); }, [activeKey]);
  useEffect(() => { const resize = () => { if (window.innerWidth > 991) setMobileOpen(false); }; window.addEventListener("resize", resize); return () => window.removeEventListener("resize", resize); }, []);
  const logout = async () => { setLoggingOut(true); try { await logoutCmsUser(); showCmsToast("Logged out successfully.", { type: "success" }); } finally { navigate("/cms/login", { replace: true }); } };

  return <section className={`admin-legacy-shell${mobileOpen ? " is-mobile-nav-open" : ""}`}>
    <header className="admin-legacy-shell__header"><div className="admin-legacy-shell__header-actions admin-legacy-shell__header-actions--mobile"><button className="admin-legacy-shell__icon-button admin-legacy-shell__icon-button--mobile" type="button" aria-expanded={mobileOpen} aria-label="Toggle navigation" onClick={() => setMobileOpen((open) => !open)}><i className="fas fa-bars"></i></button></div><div className="admin-legacy-shell__brand"><img src="/image/logo.png" className="logo" alt="The Postgraduate College logo" /><h1>The Postgraduate College</h1></div></header>
    <div className="admin-legacy-shell__layout"><aside className="admin-legacy-shell__sidebar"><ul className="admin-legacy-shell__nav">{navItems.map((item) => { const open = openGroups.has(item.key); return <li className={`admin-legacy-shell__nav-item${item.key === activeKey ? " is-active" : ""}${item.children ? " has-children" : ""}${open ? " is-open" : ""}`} key={item.key}>{item.children ? <><button type="button" className="admin-legacy-shell__nav-toggle" aria-expanded={open} onClick={() => setOpenGroups((groups) => { const next = new Set(groups); next.has(item.key) ? next.delete(item.key) : next.add(item.key); return next; })}><span className="admin-legacy-shell__nav-toggle-main"><i className={`fas ${item.icon}`}></i><span>{item.label}</span></span><span className="admin-legacy-shell__nav-caret"><i className="fas fa-chevron-down"></i></span></button><ul className="admin-legacy-shell__subnav">{item.children.map((child) => <li className={`admin-legacy-shell__subnav-item${child.key === activeChildKey ? " is-active" : ""}`} key={child.key}><a href={child.href} data-link onClick={() => setMobileOpen(false)}>{child.label}</a></li>)}</ul></> : <a href={item.href} data-link onClick={() => setMobileOpen(false)}><i className={`fas ${item.icon}`}></i><span>{item.label}</span></a>}</li>; })}<li className="admin-legacy-shell__nav-item admin-legacy-shell__nav-item--logout"><button type="button" onClick={() => void logout()} disabled={loggingOut}><i className="fas fa-sign-out-alt"></i><span>{loggingOut ? "Logging out..." : "Logout"}</span></button></li></ul></aside>
      <div className="admin-legacy-shell__main"><section id="dash-header" className="admin-legacy-shell__hero"><div className="dash-header-content"><h2>{heroTitle}</h2><p>{heroLead}</p></div></section><section className="admin-legacy-shell__content">{children}</section></div>
    </div>
  </section>;
}
