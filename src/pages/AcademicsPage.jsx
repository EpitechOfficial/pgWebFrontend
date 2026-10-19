import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { getAcademicsSidebarItems } from "../components/academicsSidebarItems.js";
import { fetchAcademicsContent } from "../services/site.js";
import { getDepartmentMatch } from "../utils/programmeSearch.js";
import { removeEditorFooter, resolveImage } from "../utils/siteContent.js";

export async function loadAcademicsPage() {
  const response = await fetchAcademicsContent();
  return { ...response.data, selectedDepartment: new URLSearchParams(window.location.search).get("department") || "" };
}

export default function AcademicsPage({ model }) {
  const navigate = useNavigate();
  const academic = model.academic || {};
  const departments = model.departments || [];
  const selectedDepartment = model.selectedDepartment || "";
  const [query, setQuery] = useState(selectedDepartment);
  const matchedDepartment = getDepartmentMatch(departments, selectedDepartment);
  const search = () => {
    const value = query.trim();
    if (!value) return;
    navigate(`/program?department=${encodeURIComponent(getDepartmentMatch(departments, value) || value)}`);
  };

  return <div className="academics-page" data-academics-page>
    <LegacyPageHero id="con" pageClass="academics-hero" backgroundImage={resolveImage(academic.image)} title="Academics" />
    <section id="doc" className="academics-doc"><div className="container"><div className="doc-page">
      <LegacySidebarNav items={getAcademicsSidebarItems()} />
      <LegacyContentPanel pageClass="academics-copy-card">
        <h2 className="text-center">Academics</h2>
        <h4 className="mb-2">{academic.head || "Academic pathways and postgraduate study"}</h4>
        <div className="academics-rich-content" dangerouslySetInnerHTML={{ __html: removeEditorFooter(academic.intro) }} />
        <h3 className="text-left">Course Finder</h3>
        <div className="academics-rich-content" dangerouslySetInnerHTML={{ __html: removeEditorFooter(academic.finder) }} />
        <div id="course" data-academics-search><h6 className="finder">Course Finder</h6>
          {selectedDepartment ? <p className="academics-search-note">Showing closest match for <strong>{selectedDepartment}</strong>{matchedDepartment ? <>: <span>{matchedDepartment}</span></> : null}</p> : null}
          <div className="search"><input type="text" name="programme" id="academics-programme-input" className="form-control" placeholder="Search by programme" list="academics-programmes" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); search(); } }} /><button className="far" id="academics-programme-submit" type="button" onClick={search}><i className="fas fa-search"></i></button><datalist id="academics-programmes">{departments.map((department) => <option value={department} key={department}></option>)}</datalist></div>
          <h5 className="c-list"><a href="/programmes" data-link>List of All Postgraduate Courses</a></h5>
        </div>
      </LegacyContentPanel>
    </div></div></section>
  </div>;
}
