import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHomeContent, fetchStatistics } from "../services/site.js";
import { getDepartmentMatch } from "../utils/programmeSearch.js";
import { resolveImage } from "../utils/siteContent.js";

function getDefaultSession() {
  const year = new Date().getFullYear();
  return `${year}/${String(year + 1).slice(-2)}`;
}

function pickField(record, candidates) {
  if (!record || typeof record !== "object") return "";
  const match = candidates.find((key) => typeof record[key] === "string" && record[key].trim() !== "");
  return match ? record[match] : "";
}

function publicImage(value, { defaultImage = "the_college.jpg", preferredFolder = "image" } = {}) {
  return resolveImage(value, preferredFolder, defaultImage);
}

function plainSummary(item) {
  const value = pickField(item, ["text", "body", "description", "intro"]);
  if (!value) return "Explore this flagship postgraduate opportunity.";
  const plain = String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > 220 ? `${plain.slice(0, 217)}...` : plain;
}

function cleanSpeech(value) {
  if (!value) return "<p>Welcome to the Postgraduate College.</p>";
  return String(value).replace(/<p[^>]*>\s*Powered by[\s\S]*?<\/p>/gi, "").trim();
}

function sessionChoices(defaultSession) {
  const now = new Date().getFullYear();
  const list = [0, 1, 2, 3, 4].map((offset) => `${now - offset}/${String(now + 1 - offset).slice(-2)}`);
  if (!list.includes(defaultSession)) list.unshift(defaultSession);
  return [...new Set(list)];
}

function Stats({ stats }) {
  const values = [
    ["Registered Students", "fa-user-graduate", stats.registered],
    ["Applications", "fa-file-alt", stats.applications],
    ["Admitted Students", "fa-user-check", stats.admitted],
    ["Graduating Students", "fa-graduation-cap", stats.graduating]
  ];
  return values.map(([label, icon, value]) => <div className="stat-card" key={label}><div className="stat-icon"><i className={`fas ${icon}`}></i></div><div className="stat-content"><div className="stat-number"><span className="count">{Number(value || 0).toLocaleString()}</span></div><p className="stat-title">{label}</p></div></div>);
}

function HeroCarousel({ slides }) {
  const items = slides.length ? slides.slice(0, 8) : [{}];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const move = (step) => setCurrent((index) => (index + step + items.length) % items.length);

  useEffect(() => {
    if (paused || items.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), 6000);
    return () => window.clearInterval(timer);
  }, [paused, items.length]);

  return <div className="home-carousel" data-home-carousel onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}><div className="carousel-inner">{items.map((slide, index) => {
    const title = slides.length ? pickField(slide, ["title", "name", "heading", "caption"]) || `Feature ${index + 1}` : "The Postgraduate College";
    const source = slides.length ? publicImage(pickField(slide, ["image", "image_url", "img", "photo", "banner"])) : "/image/the_college.jpg";
    const link = pickField(slide, ["imagelink", "link", "url", "href"]);
    const image = <img className="d-block w-100" src={source || "/image/the_college.jpg"} alt={title} />;
    return <div className={`home-carousel-item${index === current ? " is-active" : ""}`} data-home-slide key={`${source}-${index}`}>{link ? <a href={link} target="_blank" rel="noreferrer">{image}</a> : image}</div>;
  })}</div><button className="carousel-control-prev" type="button" onClick={() => move(-1)} data-carousel-prev aria-label="Previous slide"><span className="carousel-control-prev-icon" aria-hidden="true"></span></button><button className="carousel-control-next" type="button" onClick={() => move(1)} data-carousel-next aria-label="Next slide"><span className="carousel-control-next-icon" aria-hidden="true"></span></button></div>;
}

function QuickLinks({ links }) {
  const [openMenu, setOpenMenu] = useState(-1);
  const root = useRef(null);
  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpenMenu(-1); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return <div id="cards" ref={root}>{links.slice(0, 4).map((link, index) => {
    const double = link.label === "Admissions/Application Portal" || link.label === "Registration/Student Portal";
    const buttonClass = `btn${double ? " btn-double" : ""}`;
    return <div className={`card${index === 3 ? " card-last" : ""}`} key={`${link.label}-${index}`}><div className="card-img"><img src={publicImage(link.image, { preferredFolder: "img" })} alt={link.label} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/image/the_college.jpg"; }} /></div><div className={`card-btn card-btn--modern${link.type === "menu" ? " card-btn--has-dropdown" : ""}`}>{link.type === "menu" ? <><button className={`${buttonClass} btn-bor dropdown-toggle card-btn__action`} type="button" aria-haspopup="true" aria-expanded={openMenu === index} data-quick-link-toggle onClick={(event) => { event.preventDefault(); setOpenMenu((current) => current === index ? -1 : index); }}><span className="card-btn__label">{link.label}</span></button><div className={`dropdown-menu quick-link-dropdown__menu${openMenu === index ? " show" : ""}`}>{(link.items || []).map((item) => <a className="dropdown-item card-btn__action" href={item.href} target="_blank" rel="noreferrer" key={item.label}>{item.label}</a>)}</div></> : <a className={`${buttonClass} card-btn__action`} href={link.href} {...(link.type === "external" ? { target: "_blank", rel: "noreferrer" } : {})}><span className="card-btn__label">{link.label}</span></a>}<span className="card-btn__icon-wrap"><i className="fas far fa-arrow-right"></i></span></div></div>;
  })}</div>;
}

function FlagshipCarousel({ programs, departments }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(() => window.innerWidth >= 992 ? 3 : window.innerWidth >= 768 ? 2 : 1);
  const [paused, setPaused] = useState(false);
  const move = (step) => { if (programs.length) setCurrent((index) => (index + step + programs.length) % programs.length); };

  useEffect(() => {
    const resize = () => setVisible(window.innerWidth >= 992 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    if (paused || programs.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [paused, programs.length]);

  const width = `${100 / visible}%`;
  return <div className="containerr" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}><div className="scro"><a href="#myCarousel" role="button" data-flagship-prev aria-label="Previous" onClick={(event) => { event.preventDefault(); move(-1); }}><svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 384 512"><path d="M380.6 81.7c7.9 15.8 1.5 35-14.3 42.9L103.6 256 366.3 387.4c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3l-320-160C6.8 279.2 0 268.1 0 256s6.8-23.2 17.7-28.6l320-160c15.8-7.9 35-1.5 42.9 14.3z" /></svg></a><h2 className="text-center hm mb-2">Flagship Programmes</h2><a href="#myCarousel" role="button" data-flagship-next aria-label="Next" onClick={(event) => { event.preventDefault(); move(1); }}><svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 384 512"><path d="M3.4 81.7c-7.9 15.8-1.5 35 14.3 42.9L280.5 256 17.7 387.4C1.9 395.3-4.5 414.5 3.4 430.3s27.1 22.2 42.9 14.3l320-160c10.8-5.4 17.7-16.5 17.7-28.6s-6.8-23.2-17.7-28.6l-320-160c-15.8-7.9-35-1.5-42.9 14.3z" /></svg></a></div>{programs.length ? <div id="myCarousel" className="carousel slide flagship-carousel" data-flagship-carousel><div className="carousel-inner carol-inn row w-100 mx-auto">{programs.map((program, index) => {
    const relative = (index - current + programs.length) % programs.length;
    const active = relative < visible;
    const department = pickField(program, ["title", "department", "course"]);
    const resolved = getDepartmentMatch(departments, department);
    const href = resolved ? `/program?department=${encodeURIComponent(resolved)}` : `/academics?departments=${encodeURIComponent(resolved)}`;
    const title = pickField(program, ["program", "title", "name", "heading"]) || "Programme";
    return <div className={`carousel-item flag col-md-4${active ? " active" : ""}`} data-flagship-slide key={`${title}-${index}`} style={{ display: active ? "block" : "none", float: "none", marginRight: 0, width, flexBasis: width, maxWidth: width }}><div className="news-card"><img src={publicImage(pickField(program, ["image", "photo", "img", "banner"]))} alt={title} /><h2 className="tit">{title}</h2><p>{plainSummary(program)}</p><button className="read-more-button"><a href={href} data-link>Read More</a></button></div></div>;
  })}</div></div> : <p className="empty-state">Flagship programmes will appear here when the API is connected to the production database.</p>}</div>;
}

export async function loadHomePage() {
  const session = getDefaultSession();
  const [homeResponse, statsResponse] = await Promise.all([fetchHomeContent(), fetchStatistics(session)]);
  return { session, home: homeResponse.data, stats: statsResponse.data };
}

export default function HomePage({ model }) {
  const { home, session } = model;
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(session);
  const [stats, setStats] = useState(model.stats);
  const [statsStatus, setStatsStatus] = useState("");
  const [query, setQuery] = useState("");
  const sessions = useMemo(() => sessionChoices(session), [session]);
  const departments = home.departments || [];

  const updateStats = async (nextSession) => {
    setSelectedSession(nextSession); setStatsStatus("Loading updated statistics...");
    try { const response = await fetchStatistics(nextSession); setStats(response.data); setStatsStatus(""); }
    catch (error) { setStatsStatus(error.message); }
  };
  const search = () => {
    const value = query.trim();
    if (!value) return;
    const department = getDepartmentMatch(departments, value) || value;
    navigate(`/program?department=${encodeURIComponent(department)}`);
  };
  const provost = home.provost || {};
  const provostName = pickField(provost, ["name", "full_name", "provost", "title"]);
  const provostImage = publicImage(pickField(provost, ["image", "photo", "img"]), { defaultImage: "provost.jpg" });

  return <div className="home-page" data-home-page>
    <div className="head-tailer"><section id="tailer"><HeroCarousel slides={home.carousel || []} /><div className="search" data-programme-search><input type="text" name="programme" id="home-programme-input" className="form-control home-programme-search" placeholder="Search by programme" list="home-programmes" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); search(); } }} /><button className="far" id="home-programme-submit" type="button" onClick={search}><i className="fas fa-search"></i></button><datalist id="home-programmes">{departments.map((department) => <option value={department} key={department}></option>)}</datalist></div></section></div>
    <section id="statistics"><div className="containerr"><h2 className="text-center hm mb-4">Statistics</h2><div className="selector-wrapper"><div className="session-selector"><label htmlFor="session-dropdown">Select Session:</label><select id="session-dropdown" className="form-control" data-session-select value={selectedSession} onChange={(event) => void updateStats(event.target.value)}>{sessions.map((item) => <option value={item} key={item}>{item}</option>)}</select></div></div><div className="stats-container" data-stats-grid>{statsStatus ? <p className="empty-state">{statsStatus}</p> : <Stats stats={stats} />}</div></div></section>
    <section id="speech"><div className="containerr"><h2 className="text-center hm mb-2">Provost&apos;s Speech</h2><div className="speech"><div className="speech-img"><img src={provostImage} alt={provostName || "Provost"} /></div><div className="speech-content" dangerouslySetInnerHTML={{ __html: cleanSpeech(pickField(provost, ["message", "body", "profile", "speech", "content"])) }} /></div></div></section>
    <section id="more" className="home-feature-section home-feature-section--discover"><h2 className="text-center hm">Discover More</h2><div className="containerr more"><QuickLinks links={home.quickLinks || []} /></div></section>
    <section id="news" className="home-feature-section home-feature-section--flagship"><FlagshipCarousel programs={home.flagshipPrograms || []} departments={departments} /></section>
  </div>;
}
