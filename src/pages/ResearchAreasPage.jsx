import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { getAcademicsSidebarItems } from "../components/academicsSidebarItems.js";
import { fetchResearchAreaOptions, fetchResearchAreasContent } from "../services/site.js";
import { resolveImage } from "../utils/siteContent.js";

export async function loadResearchAreasPage() {
  const response = await fetchResearchAreasContent();
  return response.data;
}

export default function ResearchAreasPage({ model }) {
  const navigate = useNavigate();
  const academic = model.academic || {};
  const faculties = model.faculties || [];
  const [facultyId, setFacultyId] = useState(String(faculties[0]?.id || ""));
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [degreeId, setDegreeId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(Boolean(facultyId));

  useEffect(() => {
    let current = true;
    setDepartments([]); setDegrees([]); setDepartmentId(""); setDegreeId("");
    if (!facultyId) { setLoading(false); return () => { current = false; }; }
    setLoading(true); setStatus("Loading available departments and degrees...");
    void fetchResearchAreaOptions(facultyId).then((response) => {
      if (!current) return;
      const nextDepartments = response.data?.departments || [];
      const nextDegrees = response.data?.degrees || [];
      setDepartments(nextDepartments); setDegrees(nextDegrees);
      setDepartmentId(String(nextDepartments[0]?.id || "")); setDegreeId(String(nextDegrees[0]?.id || "")); setStatus("");
    }).catch((error) => {
      if (!current) return;
      setStatus(error.message); setDepartments([]); setDegrees([]);
    }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [facultyId]);

  const submit = (event) => {
    event.preventDefault();
    if (!facultyId || !departmentId || !degreeId) { setStatus("Please select a faculty, department, and degree before searching."); return; }
    const params = new URLSearchParams({ facultyId, departmentId, degreeId });
    navigate(`/areas-list?${params.toString()}`);
  };

  return <div className="research-areas-page" data-research-areas-page>
    <LegacyPageHero id="con" pageClass="research-areas-page__hero" backgroundImage={resolveImage(academic.image)} title="Research Areas" />
    <section id="doc" className="research-areas-page__doc"><div className="container"><div className="doc-page"><LegacySidebarNav items={getAcademicsSidebarItems("areas")} /><LegacyContentPanel pageClass="research-areas-page__content-card">
      <h4 className="hd">Advance programme Finder</h4><p className="research-areas-page__intro">Use the programme finder to search for the full list of fields of interest and programmes available.</p>
      <div id="course" className="research-areas-page__finder"><h6 className="finder">Research Area/Programme Finder</h6><form method="get" action="/areas-list" data-research-areas-form onSubmit={submit}>
        <div className="form-group"><label htmlFor="research-faculty">Faculty</label><select name="faculty" id="research-faculty" data-research-faculty value={facultyId} onChange={(event) => setFacultyId(event.target.value)}>{faculties.map((faculty) => <option value={faculty.id} key={faculty.id}>{faculty.faculty}</option>)}</select></div>
        <div className="form-group"><label htmlFor="research-department">Department</label><select name="department" id="research-department" data-research-department value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}><option value="">{loading ? "Loading departments..." : "Select department"}</option>{departments.map((item) => <option value={item.id} key={item.id}>{item.label || item.department || ""}</option>)}</select></div>
        <div className="form-group"><label htmlFor="research-degree">Degree</label><select name="degree" id="research-degree" data-research-degree value={degreeId} onChange={(event) => setDegreeId(event.target.value)}><option value="">{loading ? "Loading degrees..." : "Select degree"}</option>{degrees.map((item) => <option value={item.id} key={item.id}>{item.label || item.degree || ""}</option>)}</select></div>
        <div className="research-areas-page__status" data-research-status>{status}</div><input type="hidden" value={facultyId} data-research-initial-faculty readOnly /><input type="submit" value="Search" name="send" className="btn btn-dark research-areas-page__submit" />
      </form></div>
    </LegacyContentPanel></div></div></section>
  </div>;
}
