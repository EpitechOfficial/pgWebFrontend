import { useMemo, useState } from "react";
import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { fetchAcademicsContent } from "../services/site.js";
import { resolveImage } from "../utils/siteContent.js";

const formItems = [
  ["Academic Gown Measurement", "/forms/143930.pdf"],
  ["Application for Industrial Training Placement", "/forms/101153.pdf"],
  ["Application for Local Conference Grant", "/forms/131347.pdf"],
  ["Application for Teaching and Research Assistantship Award Competition for 2018/19 Session", "/forms/151709.pdf"],
  ["Application Form for Local Conference Grant", "/forms/183824.pdf"],
  ["CIP and IITA Call for Application", "/forms/149546.pdf"],
  ["Claim Form For External Examiners For Higher Degree", "/forms/148805.pdf"],
  ["Claim Form For Internal Examiners", "/forms/157838.pdf"],
  ["Clearance Form", "/forms/143423.pdf"],
  ["Collection of Certificate", "/forms/182630.pdf"],
  ["Departmental Sundry Forms", "http://app.pgcollegeui.com:8080/pgforms/"],
  ["Examiners Report on Thesis/Dissertation", "/forms/109683.pdf"],
  ["External Examiner Accommodation Claim Form", "/forms/133723.doc"],
  ["Guidelines For Preparing Examiners Joint Report", "/168417.doc"],
  ["Honorarium Form for Retired Academics Supervisors", "/forms/134765.docx"],
  ["NeuroAids Research Training Program", "/forms/127147.pdf"],
  ["Oral Examiner Processing Form", "/forms/164454.pdf"],
  ["PhD Scholarship Form", "/forms/192012.pdf"],
  ["PhD Supervision Form and Claim Form", "/forms/145572.doc"],
  ["Plagiarism Detection Application Workshop Material", "/forms/142422.pdf"],
  ["Postdoctoral Research Fellowship", "/forms/113980.pdf"],
  ["Postgraduate School Scholarship/Teaching & Research Assistantship Claim Form", "/forms/105086.doc"],
  ["Progress Report", "/forms/120556.doc"],
  ["Reactivation of Lapsed and Suspended Registration", "/forms/130055.pdf"],
  ["Reactivation of Laspe Registration", "/forms/150260.pdf"],
  ["Request for Approval to Conduct Oral Examination", "/forms/196652.pdf"],
  ["Request for MPhilPhD Conversion examination", "/forms/105776.pdf"],
  ["Request for Notification of Result Form", "/forms/185498.pdf"],
  ["Scholarship/ Award Form", "/forms/176169.pdf"],
  ["Suspension Of Registration", "/forms/173740.pdf"],
  ["UHS Internal Memo", "/forms/103635.pdf"],
  ["Undertaking Letter for Presentation of Original Certificate", "/forms/118220.doc"]
].map(([label, href]) => ({ label, href }));

export async function loadFormsPage() { return (await fetchAcademicsContent()).data; }

const sidebarItems = [
  { href: "/", label: "Home", icon: "fa-chevron-left", className: "als", internal: true },
  { href: "/academics", label: "Academics", internal: true }, { href: "/why", label: "Why&nbsp;Us", internal: true },
  { href: "/areas", label: "Research&nbsp;Areas", internal: true }, { href: "/programmes", label: "Programmes", internal: true },
  { href: "/admissions", label: "Admissions", internal: true }, { href: "/fees", label: "Fees & Funding", internal: true }, { href: "/contact", label: "Contact Us", internal: true }
];

export default function FormsPage({ model }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => { const value = query.trim().toLowerCase(); return value ? formItems.filter((item) => item.label.toLowerCase().includes(value)) : formItems; }, [query]);
  return <div className="forms-page" data-forms-page><LegacyPageHero id="con" pageClass="forms-page__hero" backgroundImage={resolveImage(model.academic?.image)} title="Forms" /><section id="doc" className="forms-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={sidebarItems} /><LegacyContentPanel pageClass="forms-page__content-card"><h2 className="text-center">Forms</h2><p className="forms-page__intro">Open any form below to view, download, or continue to the related external process.</p><div className="forms-page__search"><input type="text" placeholder="Search forms" aria-label="Search forms" data-forms-search value={query} onChange={(event) => setQuery(event.target.value)} /></div>{filtered.length ? null : <p className="forms-page__empty" data-forms-empty>No forms match your search.</p>}<ul className="forms-page__list" data-forms-list>{filtered.map((item) => <li data-form-item data-form-label={item.label.toLowerCase()} key={item.href}><a href={item.href} target="_blank" rel="noreferrer"><span>{item.label}</span><strong>Open</strong></a></li>)}</ul></LegacyContentPanel></div></div></section></div>;
}
