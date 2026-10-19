import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { ProgrammeBody } from "../components/ProgrammeDetailSections.jsx";
import { getAcademicsSidebarItems } from "../components/academicsSidebarItems.js";
import { fetchProgrammeOverview } from "../services/site.js";
import { removeEditorFooter, resolveImage } from "../utils/siteContent.js";

export async function loadProgramOverviewPage() {
  const department = new URLSearchParams(window.location.search).get("department") || "";
  if (!department) throw new Error("A department is required to open the programme overview.");
  const response = await fetchProgrammeOverview(department);
  return { ...response.data, query: { department } };
}

function ValueList({ values, emptyText }) {
  return values.length ? <ul>{values.map((value, index) => <li key={`${value}-${index}`}>{value}</li>)}</ul> : emptyText;
}

export default function ProgramOverviewPage({ model }) {
  const academic = model.academic || {};
  const guide = model.guide || {};
  const course = model.course || {};
  const faculty = model.faculty || {};
  const department = model.department || {};
  return <div className="program-overview-page programme-detail-page">
    <LegacyPageHero id="con" pageClass="program-overview-page__hero" backgroundImage={resolveImage(academic.image)} title="Programme" />
    <section id="doc" className="program-overview-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={getAcademicsSidebarItems("programmes")} /><LegacyContentPanel pageClass="program-overview-page__content-card">
      <h2>{faculty.faculty || ""} / {department.department || model.query?.department || ""}</h2><h4 className="hd" id="overview">Overview</h4>
      <div className="fact-file mb"><dl><dt className="mb-3">Degree awarded:</dt><dd className="mb-3"><ValueList values={model.degrees || []} emptyText="Not Applicable" /></dd><dt className="mb-3">Programmes:</dt><dd className="mb-3"><ValueList values={model.narrations || []} emptyText="Not Available" /></dd><dt className="mb-3">Field of interest:</dt><dd className="mb-3"><ValueList values={model.fields || []} emptyText="Not Applicable" /></dd><dt className="mb-3">Entry requirements:</dt><dd><div className="text mb-3"><ul dangerouslySetInnerHTML={{ __html: removeEditorFooter(course.requirement || "") }} /></div></dd><dt className="how-to-apply">How to apply:</dt><dd className="how-to-apply"><a href={guide.link || "https://apps.pgcollege.ui.edu.ng/application/"} className="btn apply-button ApplyLink" target="_blank" rel="noreferrer">Apply online</a></dd></dl></div>
      <ProgrammeBody course={course} facilities={model.facilities || []} supervisors={model.supervisors || []} guideLink={guide.link} />
    </LegacyContentPanel></div></div></section>
  </div>;
}
