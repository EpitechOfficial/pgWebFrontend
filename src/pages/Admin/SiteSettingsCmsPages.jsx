import { useState } from "react";
import AdminShell from "../../components/Admin/AdminShell.jsx";
import { fetchExternalLinks, fetchSectionalHeads, updateExternalLinks, updateSectionalHeads } from "../../services/api";
import { notifyCmsStatus, redirectToCmsLogin } from "../../utils/cmsPage.js";

function Banner({ status }) {
  return status.message ? <div className={`admin-legacy-shell__info-banner${status.error ? " is-error" : " is-success"}`}>{status.message}</div> : null;
}

const refresh = () => window.dispatchEvent(new PopStateEvent("popstate"));

export async function loadSectionalHeadsCmsPage() {
  try {
    return { heads: await fetchSectionalHeads() };
  } catch {
    redirectToCmsLogin();
    throw new Error("Redirecting to login...");
  }
}

const emptyHead = { role: "", subtitle: "", name: "", image: "", credentials: "", phone: "", emails: [] };

export function SectionalHeadsCmsPage({ model }) {
  const heads = model.heads || [];
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyHead);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState({ message: "", error: false });
  const [modalStatus, setModalStatus] = useState({ message: "", error: false });
  const [busy, setBusy] = useState(false);

  const open = (index = null) => {
    const head = index === null ? emptyHead : heads[index];
    setEditing(index);
    setDraft({ ...emptyHead, ...head, emails: [...(head.emails || [])] });
    setPreview(head.image || "");
    setModalStatus({ message: "", error: false });
  };
  const close = () => { setEditing(null); setDraft(emptyHead); setPreview(""); setBusy(false); setModalStatus({ message: "", error: false }); };
  const remove = async (index) => {
    if (!window.confirm("Delete this sectional head?")) return;
    setStatus({ message: "Deleting sectional head...", error: false });
    try {
      await updateSectionalHeads(heads.filter((_, itemIndex) => itemIndex !== index));
      setStatus({ message: "Deleted successfully.", error: false });
      refresh();
    } catch {
      setStatus({ message: "Failed to delete.", error: true });
    }
  };
  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) { setPreview(draft.image || ""); return; }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setModalStatus({ message: "", error: false });
    const data = new FormData(event.currentTarget);
    const head = {
      role: String(data.get("role") || ""), subtitle: String(data.get("subtitle") || ""),
      name: String(data.get("name") || ""), image: preview || draft.image || "",
      credentials: String(data.get("credentials") || ""), phone: String(data.get("phone") || ""),
      emails: String(data.get("emails") || "").split(/\s*,\s*/).filter(Boolean)
    };
    const next = [...heads];
    if (editing === null) next.push(head); else next[editing] = head;
    try {
      await updateSectionalHeads(next);
      setStatus({ message: "Saved successfully!", error: false });
      close();
      refresh();
    } catch {
      setModalStatus({ message: "Failed to save.", error: true });
      setBusy(false);
    }
  };

  return <AdminShell activeKey="sectional-heads" heroTitle="Sectional Heads" heroLead="Edit the principal officers and administrative heads.">
    <div className="admin-legacy-shell__section-head"><h4 className="hd">Sectional Heads</h4><button type="button" className="admin-legacy-shell__add-trigger mb-2" onClick={() => open()}><i className="fas fa-plus"></i> Add Sectional Head</button></div>
    <Banner status={status} />
    <div className="admin-legacy-shell__carousel-grid">{heads.map((head, index) => <article className="admin-legacy-shell__carousel-card admin-legacy-shell__carousel-card--sectional-head" key={`${head.name}-${index}`}>
      <div className="admin-legacy-shell__carousel-image admin-legacy-shell__carousel-image--portrait"><img src={head.image || "/image/placeholder.png"} alt={head.name || head.role || "Sectional Head"} /></div>
      <div className="admin-legacy-shell__sectional-head-meta"><p className="admin-legacy-shell__flagship-label">{head.role || ""}</p><h3>{head.name || "Unnamed"}</h3><p className="admin-legacy-shell__sectional-head-title">{head.subtitle || ""}</p><p className="admin-legacy-shell__sectional-head-credentials">{head.credentials || ""}</p><p className="admin-legacy-shell__sectional-head-phone">{head.phone || ""}</p><p className="admin-legacy-shell__sectional-head-emails">{(head.emails || []).join(", ")}</p></div>
      <div className="admin-legacy-shell__carousel-actions"><button type="button" className="admin-legacy-shell__btn admin-legacy-shell__btn--update" onClick={() => open(index)}>Edit</button><button type="button" className="admin-legacy-shell__btn admin-legacy-shell__btn--delete" onClick={() => void remove(index)}>Delete</button></div>
    </article>)}</div>
    {editing !== null || draft !== emptyHead ? <div className="admin-legacy-shell__modal"><div className="admin-legacy-shell__modal-backdrop" onClick={close}></div><div className="admin-legacy-shell__modal-dialog admin-legacy-shell__modal-dialog--wide" role="dialog" aria-modal="true" aria-labelledby="sectional-head-modal-title"><div className="admin-legacy-shell__modal-header"><h5 id="sectional-head-modal-title">Sectional Head</h5><button type="button" className="admin-legacy-shell__modal-close" onClick={close} aria-label="Close"><span aria-hidden="true">&times;</span></button></div>
      <form className="admin-legacy-shell__upload-form admin-legacy-shell__upload-form--modal" encType="multipart/form-data" onSubmit={(event) => void save(event)}><Banner status={modalStatus} />
        <div className="form-group"><label htmlFor="sectional-head-image">Choose image:</label><input id="sectional-head-image" type="file" name="uploadfile" accept=".png,.jpg,.jpeg,.avif" onChange={chooseImage} />{preview ? <img className="admin-legacy-shell__edit-preview-image" src={preview} alt="Sectional head image preview" style={{ maxWidth: 120, marginTop: 8 }} /> : null}</div>
        {[['role', 'Role:', true], ['subtitle', 'Subtitle:'], ['name', 'Name:', true], ['credentials', 'Credentials:'], ['phone', 'Phone:']].map(([name, label, required]) => <div className="form-group" key={name}><label htmlFor={`sectional-head-${name}`}>{label}</label><input type="text" id={`sectional-head-${name}`} name={name} required={required} defaultValue={draft[name] || ""} /></div>)}
        <div className="form-group"><label htmlFor="sectional-head-emails">Emails (comma separated):</label><input type="text" id="sectional-head-emails" name="emails" defaultValue={(draft.emails || []).join(", ")} /></div>
        <div className="admin-legacy-shell__upload-actions"><button type="button" className="admin-legacy-shell__btn admin-legacy-shell__btn--cancel" onClick={close}>Close</button><button type="submit" className="admin-legacy-shell__btn admin-legacy-shell__btn--update" disabled={busy}>{busy ? "Saving..." : "Save"}</button></div>
      </form></div></div> : null}
  </AdminShell>;
}

export async function loadExternalLinksCmsPage() { return { links: await fetchExternalLinks() }; }

export function ExternalLinksCmsPage({ model }) {
  const links = model.links || {};
  const readOnlyKeys = new Set(["studentHandbook", "policyRegulation", "uiStyle"]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ message: "", error: false });
  const save = async (event) => {
    event.preventDefault(); setBusy(true); setStatus({ message: "", error: false });
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    for (const key of readOnlyKeys) if (key in links) data[key] = links[key] || "";
    try { await updateExternalLinks(data); setStatus({ message: "Saved successfully!", error: false }); notifyCmsStatus("Saved successfully!"); refresh(); }
    catch { setStatus({ message: "Failed to save.", error: true }); notifyCmsStatus("Failed to save.", true); setBusy(false); }
  };
  return <AdminShell activeKey="external-links" heroTitle="External Links" heroLead="Edit the external links used throughout the site."><div className="admin-legacy-shell__section-head"><h4 className="hd">External Links</h4></div><Banner status={status} /><form className="admin-legacy-shell__upload-form" onSubmit={(event) => void save(event)}>{Object.entries(links).map(([key, value]) => <div className="form-group" key={key}><label htmlFor={`external-link-${key}`}>{key}</label><input type="text" id={`external-link-${key}`} name={key} defaultValue={value || ""} readOnly={readOnlyKeys.has(key)} /></div>)}<div className="admin-legacy-shell__upload-actions"><button type="submit" className="admin-legacy-shell__btn admin-legacy-shell__btn--update" disabled={busy}>{busy ? "Saving..." : "Save"}</button></div></form></AdminShell>;
}
