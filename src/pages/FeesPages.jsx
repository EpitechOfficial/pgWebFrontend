import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { getAcademicsSidebarItems } from "../components/academicsSidebarItems.js";
import { fetchFeesContent, fetchInternationalStudentsContent } from "../services/site.js";
import { removeEditorFooter, resolveImage } from "../utils/siteContent.js";

function Rich({ value, className = "" }) { return <div className={className} dangerouslySetInnerHTML={{ __html: removeEditorFooter(value || "") }} />; }

export async function loadFeesPage() { return (await fetchFeesContent()).data; }
export async function loadInternationalStudentsPage() { return (await fetchInternationalStudentsContent()).data; }

export function FeesPage({ model }) {
  const academic = model.academic || {}; const fees = model.fees || {}; const international = model.international || {};
  const internationalIntro = removeEditorFooter(international.intro || "");
  return <div className="fees-page" data-fees-page><LegacyPageHero id="con" pageClass="fees-page__hero" backgroundImage={resolveImage(academic.image)} title="Fees & Fundings" /><section id="doc" className="fees-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={getAcademicsSidebarItems("fees")} /><LegacyContentPanel pageClass="fees-page__content-card"><h2 className="text-center">Fees and Fundings</h2><div className="fees-page__intro"><h4 dangerouslySetInnerHTML={{ __html: removeEditorFooter(fees.intro || "") }} /></div><section className="fees-page__section"><h4 className="hd mb">Fees</h4><Rich className="fees-page__rich-content" value={fees.fees} /></section><section className="fees-page__section"><h4 className="hd mb">Fundings</h4><Rich className="fees-page__rich-content" value={fees.fundings} /></section>{internationalIntro ? <section className="fees-page__section fees-page__section--international"><h4 className="hd mb">International Students</h4><Rich className="fees-page__rich-content" value={international.intro} /><a href="/foreign-student" data-link className="fees-page__link-pill">View international student guidance</a></section> : null}</LegacyContentPanel></div></div></section></div>;
}

export function InternationalStudentsPage({ model }) {
  const academic = model.academic || {}; const international = model.international || {};
  return <div className="international-students-page" data-international-students-page><LegacyPageHero id="con" pageClass="international-students-page__hero" backgroundImage={resolveImage(academic.image)} title="International Student" /><section id="doc" className="international-students-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={getAcademicsSidebarItems("foreign-student")} /><LegacyContentPanel pageClass="international-students-page__content-card"><h2 className="text-center">Admissions</h2><div className="international-students-page__intro"><h4 dangerouslySetInnerHTML={{ __html: removeEditorFooter(international.intro || "") }} /></div><section className="international-students-page__section"><h3 className="text-left">General Requirement</h3><Rich className="international-students-page__rich-content" value={international.gen_req} /></section><section className="international-students-page__section"><h3 className="text-left">Language Requirement</h3><Rich className="international-students-page__rich-content" value={international.lang_req} /></section><section className="international-students-page__section"><h3 className="text-left">Visa Guidance</h3><Rich className="international-students-page__rich-content" value={international.visa_guide} /></section></LegacyContentPanel></div></div></section></div>;
}
