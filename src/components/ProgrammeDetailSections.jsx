import { useState } from "react";
import { removeEditorFooter, resolveImage } from "../utils/siteContent.js";

export function RichContent({ value, className = "" }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: removeEditorFooter(value || "") }} />;
}

export function ProgrammeEntryTabs({ course }) {
  const [active, setActive] = useState("nigerian");
  return <div className="programme-detail__entry-tabs mb"><div className="programme-detail__tab-nav"><button className={`programme-detail__tab-button${active === "nigerian" ? " is-active" : ""}`} type="button" data-tab-target="nigerian" onClick={() => setActive("nigerian")}>Nigerian Qualification</button><button className={`programme-detail__tab-button${active === "international" ? " is-active" : ""}`} type="button" data-tab-target="international" onClick={() => setActive("international")}>International Qualification</button></div><RichContent className={`programme-detail__tab-panel${active === "nigerian" ? " is-active" : ""}`} value={course.ngrequirement} /><RichContent className={`programme-detail__tab-panel${active === "international" ? " is-active" : ""}`} value={course.foreignrequirement} /></div>;
}

export function ProgrammeFacilities({ facilities }) {
  return facilities.map((item, index) => <div className="tck programme-detail__facility-card" style={{ background: `url('${resolveImage(item.image)}') no-repeat center center/cover` }} key={`${item.header}-${index}`}><h3 className="osl">{item.header || "Facility"}</h3><p dangerouslySetInnerHTML={{ __html: removeEditorFooter(item.content || "") }} /></div>);
}

export function ProgrammeSupervisors({ supervisors }) {
  return supervisors.map((item, index) => <article className="exp-1 mb mr programme-detail__supervisor-card" key={`${item.title}-${index}`}><div className="exp-txt"><div className="prof"><div className="exp-img"><img src={resolveImage(item.image)} alt={item.title || "Supervisor"} /></div><div className="prof-name"><h4 dangerouslySetInnerHTML={{ __html: removeEditorFooter(item.name || "") }} /><h4 className="superTitle">{item.title || ""}</h4></div></div><RichContent className="programme-detail__rich-content" value={item.about} /><a className="btns" href={item.link || "#"} target="_blank" rel="noreferrer">View Profile</a></div></article>);
}

export function ProgrammeFees({ guideLink }) {
  return <><p className="mb-3">Get estimated fee for this programme using this <a href="/setup_fee" target="_blank" rel="noreferrer" style={{ fontWeight: "bold" }}>Link</a></p><a href={guideLink || "#"} className="btns" target="_blank" rel="noreferrer">Apply now</a></>;
}

export function ProgrammeBody({ course, facilities, supervisors, guideLink }) {
  return <>
    <RichContent className="programme-detail__rich-content mb" value={course.overview} />
    <h4 className="hd" id="course">Few/Some of the Course Content</h4>
    <RichContent className="programme-detail__rich-content mb-3" value={course.contentoverview} />
    <h4 className="hd" id="entry">Entry Requirement</h4><ProgrammeEntryTabs course={course} />
    <h4 className="hd" id="tools">Facilities</h4><div className="tools mb programme-detail__facilities"><ProgrammeFacilities facilities={facilities} /></div>
    <h4 className="hd" id="career">Career Path</h4><RichContent className="programme-detail__rich-content mb-3" value={course.career} />
    <h4 className="hd" id="super">Supervisor(s)</h4><div className="exps super"><ProgrammeSupervisors supervisors={supervisors} /></div>
    <h4 className="hd" id="fees">Fees</h4><ProgrammeFees guideLink={guideLink} />
  </>;
}
