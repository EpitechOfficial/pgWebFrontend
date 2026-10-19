import { useEffect, useRef, useState } from "react";
import AdminShell from "../../components/Admin/AdminShell.jsx";
import {
  fetchCmsAdmissionsAfterContent,
  fetchCmsAdmissionsContent,
  fetchCmsAdmissionsGuideContent,
  updateCmsAdmissionsAfterContent,
  updateCmsAdmissionsContent,
  updateCmsAdmissionsGuideContent
} from "../../services/site.js";
import { loadCmsPageContent } from "../../utils/cmsPage.js";
import { createRichTextManager } from "../../utils/cmsRichText.js";

const configs = {
  overview: {
    child: "admissions-overview",
    heroTitle: "Admission Page",
    heroLead: "Edit the admission page",
    heading: "Admission Page",
    source: "admissions",
    fetch: fetchCmsAdmissionsContent,
    update: updateCmsAdmissionsContent,
    initial: "",
    fields: [
      { name: "heading", source: "headings", label: "Heading:", type: "input" },
      { name: "intro", label: "Introduction:", rich: true },
      { name: "guide", source: "guide_intro", label: "Application guide intro:", type: "input" },
      { name: "after", source: "after_intro", label: "After application intro:", type: "input" },
      { name: "fee", source: "acceptance_intro", label: "Acceptance fee intro:", type: "input" },
      { name: "link", source: "acceptance_link", label: "Acceptance fee link:", type: "input" }
    ]
  },
  guide: {
    child: "admissions-guide",
    heroTitle: "Application Guide Page",
    heroLead: "Edit the application guide page",
    heading: "Application Guide",
    source: "guide",
    fetch: fetchCmsAdmissionsGuideContent,
    update: updateCmsAdmissionsGuideContent,
    initial: "Update the application guide content sections and the application link.",
    fields: [
      { name: "intro", label: "Introduction:" },
      { name: "rules", source: "rules_regulation", label: "Rules and regulations:", rich: true },
      { name: "type", source: "application_type", label: "Application type:", rich: true },
      { name: "form", source: "application_form", label: "Application form:", rich: true },
      { name: "guidelines", label: "Guidelines:", rich: true },
      { name: "criteria", label: "Criteria:", rich: true },
      { name: "requirement", label: "Requirements:", rich: true },
      { name: "link", label: "Application link:", type: "input" }
    ]
  },
  after: {
    child: "admissions-after",
    heroTitle: "After Application Page",
    heroLead: "Edit the after application page",
    heading: "After Application",
    source: "after",
    fetch: fetchCmsAdmissionsAfterContent,
    update: updateCmsAdmissionsAfterContent,
    initial: "Update the after-application flow content sections shown on the public page.",
    fields: [
      { name: "intro", label: "Introduction:" },
      { name: "track", label: "Track application:", rich: true },
      { name: "tpe", label: "Transcript processing exchange:", rich: true },
      { name: "fee", label: "Acceptance fee:", rich: true },
      { name: "clearance", label: "Clearance:", rich: true }
    ]
  }
};

const managers = Object.fromEntries(Object.keys(configs).map((kind) => [kind, createRichTextManager({
  selector: `.${kind}-admissions-cms-rich-text`,
  styleId: `pgc-admissions-${kind}-froala-style`,
  scriptId: `pgc-admissions-${kind}-froala-script`
})]));

function Banner({ status }) {
  return status.message ? <div className={`admin-legacy-shell__info-banner${status.error ? " is-error" : " is-success"}`}>{status.message}</div> : null;
}

async function load(kind) { return loadCmsPageContent(configs[kind].fetch); }
export const loadAdmissionsCmsPage = () => load("overview");
export const loadAdmissionsGuideCmsPage = () => load("guide");
export const loadAdmissionsAfterCmsPage = () => load("after");

function AdmissionsEditor({ model, kind }) {
  const config = configs[kind];
  const values = model[config.source] || {};
  const formRef = useRef(null);
  const [status, setStatus] = useState({ message: config.initial, error: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const manager = managers[kind];
    void manager.setup(formRef.current, (message = "", error = false) => setStatus({ message, error }));
    return () => manager.destroy();
  }, [kind]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus({ message: "Updating admission content...", error: false });
    const data = new FormData(event.currentTarget);
    managers[kind].syncToFormData(data);
    try {
      await config.update(data);
      setStatus({ message: "Upload done successfully.", error: false });
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (error) {
      setStatus({ message: error.message || "Unable to update admission content.", error: true });
      setBusy(false);
    }
  };

  return <AdminShell activeKey="admissions" activeChildKey={config.child} heroTitle={config.heroTitle} heroLead={config.heroLead}>
    <div className="head-carol admin-legacy-shell__section-head"><h4 className="hd" id="overview">{config.heading}</h4></div>
    <Banner status={status} />
    <form ref={formRef} className="admin-legacy-shell__upload-form admin-legacy-shell__upload-form--why" onSubmit={(event) => void submit(event)}>
      {config.fields.map((field) => <div className="form-group" key={field.name}>
        <label htmlFor={`cms-admissions-${kind}-${field.name}`}>{field.label}</label>
        {field.type === "input"
          ? <input id={`cms-admissions-${kind}-${field.name}`} name={field.name} type="text" required defaultValue={values[field.source || field.name] || ""} />
          : <textarea className={field.rich ? `${kind}-admissions-cms-rich-text` : undefined} id={`cms-admissions-${kind}-${field.name}`} name={field.name} rows="8" required defaultValue={values[field.source || field.name] || ""} />}
      </div>)}
      <div className="admin-legacy-shell__upload-actions"><button type="submit" className="admin-legacy-shell__add-trigger" disabled={busy}>{busy ? "Uploading..." : "Upload"}</button></div>
    </form>
  </AdminShell>;
}

export function AdmissionsCmsPage({ model }) { return <AdmissionsEditor model={model} kind="overview" />; }
export function AdmissionsGuideCmsPage({ model }) { return <AdmissionsEditor model={model} kind="guide" />; }
export function AdmissionsAfterCmsPage({ model }) { return <AdmissionsEditor model={model} kind="after" />; }
