import { useEffect, useRef, useState } from "react";
import AdminShell from "../../components/Admin/AdminShell.jsx";
import {
  fetchCmsContactContent,
  fetchCmsInternationalContent,
  updateCmsContactContent,
  updateCmsInternationalContent
} from "../../services/site.js";
import { loadCmsPageContent } from "../../utils/cmsPage.js";
import { createRichTextManager } from "../../utils/cmsRichText.js";

const internationalEditors = createRichTextManager({
  selector: ".international-cms-rich-text",
  styleId: "pgc-international-froala-style",
  scriptId: "pgc-international-froala-script"
});

function Banner({ status }) {
  return status.message ? <div className={`admin-legacy-shell__info-banner${status.error ? " is-error" : " is-success"}`}>{status.message}</div> : null;
}

async function submitForm({ event, update, manager, pending, failure, setBusy, setStatus }) {
  event.preventDefault();
  setBusy(true);
  setStatus({ message: pending, error: false });
  const data = new FormData(event.currentTarget);
  manager?.syncToFormData(data);
  try {
    await update(data);
    setStatus({ message: "Upload done successfully.", error: false });
    window.dispatchEvent(new PopStateEvent("popstate"));
  } catch (error) {
    setStatus({ message: error.message || failure, error: true });
    setBusy(false);
  }
}

export const loadInternationalCmsPage = () => loadCmsPageContent(fetchCmsInternationalContent);

export function InternationalCmsPage({ model }) {
  const international = model.international || {};
  const formRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ message: "Update the international student page content and guidance sections.", error: false });

  useEffect(() => {
    void internationalEditors.setup(formRef.current, (message = "", error = false) => setStatus({ message, error }));
    return () => internationalEditors.destroy();
  }, []);

  const fields = [
    { name: "intro", label: "Introduction:", rows: 6 },
    { name: "gen_req", label: "General Requirement:", rich: true },
    { name: "lang_req", label: "Language Requirement:", rich: true },
    { name: "visa_guide", label: "Visa Guidance:", rich: true }
  ];

  return <AdminShell activeKey="international" heroTitle="International Page" heroLead="Edit the international page">
    <div className="head-carol admin-legacy-shell__section-head"><h4 className="hd" id="overview">Content</h4></div>
    <Banner status={status} />
    <form ref={formRef} className="admin-legacy-shell__upload-form admin-legacy-shell__upload-form--why" onSubmit={(event) => void submitForm({ event, update: updateCmsInternationalContent, manager: internationalEditors, pending: "Updating international page...", failure: "Unable to update international page.", setBusy, setStatus })}>
      {fields.map((field) => <div className="form-group" key={field.name}>
        <label htmlFor={`cms-international-${field.name}`}>{field.label}</label>
        <textarea className={field.rich ? "international-cms-rich-text" : undefined} id={`cms-international-${field.name}`} name={field.name} rows={field.rows || 8} required defaultValue={international[field.name] || ""} />
      </div>)}
      <div className="admin-legacy-shell__upload-actions"><button type="submit" className="admin-legacy-shell__add-trigger" disabled={busy}>{busy ? "Uploading..." : "Upload"}</button></div>
    </form>
  </AdminShell>;
}

export const loadContactCmsPage = () => loadCmsPageContent(fetchCmsContactContent);

export function ContactCmsPage({ model }) {
  const contact = model.contact || {};
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ message: "", error: false });
  const fields = [
    ["phone", "Phone Number:"],
    ["email", "Email Address:"],
    ["email2", "Email Address 2:"],
    ["facebook", "Facebook Link:"],
    ["twitter", "Twitter Link:"],
    ["instagram", "Instagram Link:"]
  ];

  return <AdminShell activeKey="contact" heroTitle="Contact Page" heroLead="Edit the Contact page">
    <div className="head-carol admin-legacy-shell__section-head"><h4 className="hd" id="overview">Contact Details</h4></div>
    <Banner status={status} />
    <form className="admin-legacy-shell__upload-form admin-legacy-shell__upload-form--why" onSubmit={(event) => void submitForm({ event, update: updateCmsContactContent, pending: "Updating contact page...", failure: "Unable to update contact page.", setBusy, setStatus })}>
      {fields.map(([name, label]) => <div className="form-group" key={name}>
        <label htmlFor={`cms-contact-${name}`}>{label}</label>
        <input id={`cms-contact-${name}`} type="text" name={name} required defaultValue={contact[name] || ""} />
      </div>)}
      <div className="admin-legacy-shell__upload-actions"><button type="submit" className="admin-legacy-shell__add-trigger" disabled={busy}>{busy ? "Uploading..." : "Upload"}</button></div>
    </form>
  </AdminShell>;
}
