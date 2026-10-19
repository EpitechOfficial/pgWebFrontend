import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { ProgrammeBody } from "../components/ProgrammeDetailSections.jsx";
import { getAcademicsSidebarItems } from "../components/academicsSidebarItems.js";
import { fetchProgrammeDetail } from "../services/site.js";
import { removeEditorFooter, resolveImage } from "../utils/siteContent.js";

function programmeQuery() {
  const params = new URLSearchParams(window.location.search);
  return { faculty: params.get("faculty") || "", department: params.get("department") || "", degree: params.get("degree") || "", naration: params.get("naration") || "", interest: params.get("interest") || "" };
}

async function loadDetail() {
  const query = programmeQuery();
  if (!query.department) throw new Error("Programme details require a department. Please return to Research Areas and choose a result.");
  const response = await fetchProgrammeDetail(query.department);
  return { ...response.data, query };
}

export const loadMasterProgramPage = loadDetail;
export const loadPostgraduateProgramPage = loadDetail;

function FactFile({ query, course, guideLink, doctoral }) {
  const programmeLabels = !doctoral && query.naration ? [query.naration] : [];
  return <div className="fact-file mb"><dl><dt className="mb-3">Degree awarded:</dt><dd className="mb-3">{query.degree ? <ul><li>{query.degree}</li></ul> : "Not Applicable"}</dd>{doctoral && query.interest ? <><dt className="mb-3">Field of interest:</dt><dd className="mb-3"><ul><li>{query.interest}</li></ul></dd></> : null}{programmeLabels.length ? <><dt className="mb-3">Programmes:</dt><dd className="mb-3"><ul>{programmeLabels.map((label) => <li key={label}>{label}</li>)}</ul></dd></> : null}<dt className="mb-3">Entry requirements:</dt><dd><div className="text mb-3"><ul dangerouslySetInnerHTML={{ __html: removeEditorFooter(course.requirement || "") }} /></div></dd><dt className="how-to-apply">How to apply:</dt><dd className="how-to-apply"><a href={guideLink || "https://apps.pgcollege.ui.edu.ng/application/"} className="btn apply-button ApplyLink" target="_blank" rel="noreferrer">Apply online</a></dd></dl></div>;
}

function ProgrammeDetailPage({ model, doctoral }) {
  const academic = model.academic || {};
  const guide = model.guide || {};
  const course = model.course || {};
  const query = model.query || {};
  const pageType = doctoral ? "postgraduate-program-page" : "master-program-page";
  const overview = doctoral ? `Overview of Doctoral Programmes (${query.interest})` : `Overview of Masters Programmes (${query.naration})`;
  return <div className={`${pageType} programme-detail-page`}><LegacyPageHero id="con" pageClass={`${pageType} programme-detail-page__hero`} backgroundImage={resolveImage(academic.image)} title="Programme" /><section id="doc" className={`${pageType} programme-detail-page__doc`}><div className="container"><div className="doc-page"><LegacySidebarNav items={getAcademicsSidebarItems("programmes")} /><LegacyContentPanel pageClass="programme-detail__content-card"><h2>{query.faculty} / {query.department}</h2><h4 className="hd" id="overview">{overview}</h4><FactFile query={query} course={course} guideLink={guide.link} doctoral={doctoral} /><ProgrammeBody course={course} facilities={model.facilities || []} supervisors={model.supervisors || []} guideLink={guide.link} /></LegacyContentPanel></div></div></section></div>;
}

export function MasterProgramPage({ model }) { return <ProgrammeDetailPage model={model} doctoral={false} />; }
export function PostgraduateProgramPage({ model }) { return <ProgrammeDetailPage model={model} doctoral />; }
