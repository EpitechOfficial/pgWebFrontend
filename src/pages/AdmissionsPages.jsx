import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { getAcademicsSidebarItems } from "../components/academicsSidebarItems.js";
import { getAdmissionsSidebarItems } from "../components/admissionsSidebarItems.js";
import { fetchAdmissionsContent } from "../services/site.js";
import { removeEditorFooter, resolveImage } from "../utils/siteContent.js";

export async function loadAdmissionsContent() {
  const response = await fetchAdmissionsContent();
  return response.data;
}

function RichContent({ value, className = "" }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: removeEditorFooter(value || "") }} />;
}

function admissionsLink(value, fallback) {
  const href = String(value || "").trim();
  if (!href) return fallback;
  if (/^(https?:)?\/\//i.test(href)) return href;
  if (href.startsWith("../")) return `/pgcollege/${href.slice(3)}`;
  if (href.startsWith("/")) return href;
  return `/pgcollege/${href}`;
}

function AdmissionCard({ title, body, href, toneClass, internal = false }) {
  return <a className={`admissions-page__card ${toneClass}`} href={href} {...(internal ? { "data-link": true } : { target: "_blank", rel: "noreferrer" })}><div className="admissions-page__card-inner"><p className="admissions-page__card-kicker">Admissions</p><h3>{title}</h3><p>{body}</p><span className="admissions-page__card-link">Read more <i className="fas fa-chevron-right" aria-hidden="true"></i></span></div></a>;
}

export function AdmissionsPage({ model }) {
  const admissions = model.admissions || {};
  const academic = model.academic || {};
  return <div className="admissions-page" data-admissions-page><LegacyPageHero id="con" pageClass="admissions-page__hero" backgroundImage={resolveImage(academic.image)} title="Admissions" /><section id="doc" className="admissions-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={getAcademicsSidebarItems("admissions")} /><LegacyContentPanel pageClass="admissions-page__content-card"><h2 className="text-center">Admissions</h2><h4 className="hd">{admissions.headings || "Admissions overview"}</h4><RichContent className="admissions-page__intro" value={admissions.intro} /><div className="admissions-page__grid"><AdmissionCard title="Application Guide" body={admissions.guide_intro || "Key guidance for preparing and submitting your application."} href="/admissions/guide" toneClass="admissions-page__card--guide" internal /><AdmissionCard title="After You Apply" body={admissions.after_intro || "What happens next after submission and how to follow up."} href="/admissions/after" toneClass="admissions-page__card--after" internal /><AdmissionCard title="Acceptance Fee" body={admissions.acceptance_intro || "Continue to acceptance payment and final admission steps."} href={admissionsLink(admissions.acceptance_link, "#")} toneClass="admissions-page__card--acceptance" /></div></LegacyContentPanel></div></div></section></div>;
}

function GuideSection({ title, value }) {
  return <section className="admissions-guide-page__section"><h4 className="hd mb">{title}</h4><RichContent className="admissions-guide-page__rich-content" value={value} /></section>;
}

export function AdmissionsGuidePage({ model }) {
  const academic = model.academic || {};
  const guide = model.guide || {};
  const applyLink = guide.link || "https://apps.pgcollege.ui.edu.ng/application/";
  return <div className="admissions-guide-page" data-admissions-guide-page><LegacyPageHero id="con" pageClass="admissions-guide-page__hero" backgroundImage={resolveImage(academic.image)} title="Application Guide" /><section id="doc" className="admissions-guide-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={getAdmissionsSidebarItems("guide")} /><LegacyContentPanel pageClass="admissions-guide-page__content-card"><h2 className="text-center">Application Guide</h2><div className="admissions-guide-page__intro-callout gui"><RichContent value={guide.intro} /><div className="admissions-guide-page__actions"><a href={applyLink} className="btns" target="_blank" rel="noreferrer">Apply now</a></div></div><GuideSection title="General Rules and Regulation" value={guide.rules_regulation} /><GuideSection title="Types of Application" value={guide.application_type} /><GuideSection title="Application Forms" value={guide.application_form} /><GuideSection title="Guidelines for Filling Application Forms" value={guide.guidelines} /><GuideSection title="Admission Criteria" value={guide.criteria} /><section className="admissions-guide-page__section"><h4 className="hd mb">Available Faculties/Department</h4><p className="mb-3">Click <strong><a href="/areas" data-link>Faculties</a></strong> to access the available faculties and <strong><a href="/programmes" data-link>Department</a></strong> to access the departments.</p></section><GuideSection title="General Admission Requirements" value={guide.requirement} /><a href={applyLink} className="btns" target="_blank" rel="noreferrer">Apply now</a></LegacyContentPanel></div></div></section></div>;
}

export function AdmissionsAfterPage({ model }) {
  const academic = model.academic || {};
  const after = model.after || {};
  return <div className="admissions-after-page" data-admissions-after-page><LegacyPageHero id="con" pageClass="admissions-after-page__hero" backgroundImage={resolveImage(academic.image)} title="After You Apply" /><section id="doc" className="admissions-after-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={getAdmissionsSidebarItems("after")} /><LegacyContentPanel pageClass="admissions-after-page__content-card"><h2 className="text-center">After You Apply</h2><RichContent className="admissions-guide-page__intro-callout" value={after.intro} /><GuideSection title="Track Your Application" value={after.track} /><GuideSection title="Test for Proficiency Examination" value={after.tpe} /><GuideSection title="Acceptance Fee" value={after.fee} /><GuideSection title="Clearance" value={after.clearance} /></LegacyContentPanel></div></div></section></div>;
}
