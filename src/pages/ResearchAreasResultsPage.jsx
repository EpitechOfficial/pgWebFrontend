import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { getAcademicsSidebarItems } from "../components/academicsSidebarItems.js";
import { fetchResearchAreaResults } from "../services/site.js";
import { resolveImage } from "../utils/siteContent.js";

export async function loadResearchAreasResultsPage() {
  const params = new URLSearchParams(window.location.search);
  const facultyId = params.get("facultyId") || "";
  const departmentId = params.get("departmentId") || "";
  const degreeId = params.get("degreeId") || "";
  if (!facultyId || !departmentId || !degreeId) throw new Error("Please start from the Research Areas finder and select a faculty, department, and degree.");
  const response = await fetchResearchAreaResults(facultyId, departmentId, degreeId);
  return response.data;
}

export default function ResearchAreasResultsPage({ model }) {
  const academic = model.academic || {};
  const faculty = model.faculty || {};
  const department = model.department || {};
  const degree = model.degree || {};
  const title = model.pageTitle || "Research Areas / Departments";
  return <div className="research-areas-results-page" data-research-areas-results-page>
    <LegacyPageHero id="con" pageClass="research-areas-results-page__hero" backgroundImage={resolveImage(academic.image)} title={title} />
    <section id="doc" className="research-areas-results-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={getAcademicsSidebarItems("areas")} /><LegacyContentPanel pageClass="research-areas-results-page__content-card">
      <h2 className="text-center">{title}</h2><h4 className="dh">{faculty.faculty || ""} / {department.department || ""} / {degree.degree || ""}</h4><p className="research-areas-results-page__intro">{model.message || ""}</p>
      <ul className="area-list research-areas-results-page__list">{(model.items || []).map((item, index) => { const href = item.href || "#"; const internal = href.startsWith("/"); return <li key={`${item.label}-${index}`}><a href={href} {...(internal ? { "data-link": true } : { target: "_blank", rel: "noreferrer" })}>{item.label || ""}</a></li>; })}</ul>
    </LegacyContentPanel></div></div></section>
  </div>;
}
