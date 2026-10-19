export function LegacyPageHero({ id = "con", pageClass = "", backgroundImage = "", title = "" }) {
  return <section id={id} className={["legacy-page-hero", pageClass].filter(Boolean).join(" ")} style={{ background: `url('${backgroundImage}') no-repeat center center/cover` }}><div className="header-content"><h1 className="l-heading">{title}</h1></div></section>;
}

export function LegacySidebarNav({ items }) {
  return <div className="left legacy-side-nav"><ul>{items.map((item) => <li className={item.active ? "active" : item.className || ""} key={item.key || item.href}><a href={item.href} {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})} {...(item.internal ? { "data-link": true } : {})}>{item.icon ? <i className={`fas ${item.icon}`}></i> : null}{String(item.label || "").replaceAll("&nbsp;", "\u00a0")}</a></li>)}</ul></div>;
}

export function LegacyContentPanel({ pageClass = "", children }) {
  return <div className="right legacy-content-shell"><div className={["legacy-content-panel", pageClass].filter(Boolean).join(" ")}>{children}</div></div>;
}
