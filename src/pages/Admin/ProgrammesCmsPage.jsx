import { useEffect, useMemo, useRef, useState } from "react";
import AdminShell from "../../components/Admin/AdminShell.jsx";
import { createCmsProgramme, fetchCmsProgrammeDetail, fetchCmsProgrammesContent, toggleCmsProgramme, updateCmsProgramme } from "../../services/site.js";
import { loadCmsPageContent } from "../../utils/cmsPage.js";
import { createRichTextManager } from "../../utils/cmsRichText.js";

const editors = createRichTextManager({ selector: ".programmes-rich-text", styleId: "pgc-froala-style", scriptId: "pgc-froala-script" });
const refresh = () => window.dispatchEvent(new PopStateEvent("popstate"));

export async function loadProgrammesCmsPage() { return loadCmsPageContent(fetchCmsProgrammesContent); }

function Banner({ value, error = false }) { return value ? <div className={`admin-legacy-shell__info-banner${error ? " is-error" : " is-success"}`}>{value}</div> : null; }
function Modal({ title, onClose, children }) { return <div className="admin-legacy-shell__modal"><div className="admin-legacy-shell__modal-backdrop" onClick={onClose}></div><div className="admin-legacy-shell__modal-dialog admin-legacy-shell__modal-dialog--wide" role="dialog" aria-modal="true"><div className="admin-legacy-shell__modal-header"><h5>{title}</h5><button type="button" className="admin-legacy-shell__modal-close" onClick={onClose} aria-label="Close"><span aria-hidden="true">&times;</span></button></div>{children}</div></div>; }

function ProgrammeForm({ item, options, formRef, onSubmit, onClose, status, busy }) {
  const editing = Boolean(item);
  return <form key={editing ? `${item.department}-${item.link || "loading"}` : "add"} ref={formRef} className="admin-legacy-shell__upload-form admin-legacy-shell__upload-form--modal" onSubmit={onSubmit}><Banner value={status.message} error={status.error} />{editing ? <><input type="hidden" name="department" value={item.department || ""} readOnly /><div className="form-group"><label>Faculty:</label><input type="text" value={item.faculty || ""} readOnly /></div><div className="form-group"><label>Department:</label><input type="text" value={item.department || ""} readOnly /></div><div className="form-group"><label>Degree:</label><input type="text" value={(item.degrees || []).join(" / ")} readOnly /></div></> : <div className="form-group"><label htmlFor="cms-programme-department">Department:</label><select id="cms-programme-department" name="department" required defaultValue=""><option value="">Select department</option>{options.map((option) => <option value={option.department || ""} key={option.department}>{option.department}</option>)}</select></div>}<div className="form-group"><label>Application Link:</label><input type="text" name="link" defaultValue={item?.link || ""} required /></div><div className="form-group"><label>Requirements:</label><textarea className="programmes-rich-text" name="requirement" rows="6" required defaultValue={item?.requirement || ""} /></div><div className="form-group"><label>Course Overview:</label><textarea className="programmes-rich-text" name="overview" rows="6" required defaultValue={item?.overview || ""} /></div><div className="form-group"><label>Course Content Overview:</label><textarea className="programmes-rich-text" name="contentOverview" rows="6" required defaultValue={item?.contentoverview || ""} /></div><div className="form-group"><label>Nigerian&apos;s Requirements:</label><textarea className="programmes-rich-text" name="ngRequirement" rows="6" required defaultValue={item?.ngrequirement || ""} /></div><div className="form-group"><label>International Requirements:</label><textarea className="programmes-rich-text" name="foreignRequirement" rows="6" required defaultValue={item?.foreignrequirement || ""} /></div><div className="form-group"><label>Career:</label><textarea className="programmes-rich-text" name="career" rows="6" required defaultValue={item?.career || ""} /></div><div className="admin-legacy-shell__upload-actions"><button type="button" className="admin-legacy-shell__btn admin-legacy-shell__btn--cancel" onClick={onClose}>Close</button><button type="submit" className="admin-legacy-shell__add-trigger" disabled={busy}>{busy ? (editing ? "Saving..." : "Uploading...") : (editing ? "Save" : "Upload")}</button></div></form>;
}

export default function ProgrammesCmsPage({ model }) {
  const items = model.items || []; const options = model.programmeOptions || [];
  const [search, setSearch] = useState(""); const [modal, setModal] = useState(""); const [editItem, setEditItem] = useState(null); const [status, setStatus] = useState({ message: "", error: false }); const [modalStatus, setModalStatus] = useState({ message: "", error: false }); const [busy, setBusy] = useState(false); const formRef = useRef(null);
  const filtered = useMemo(() => { const query = search.trim().toUpperCase(); return query ? items.filter((item) => String(item.department || "").toUpperCase().includes(query)) : items; }, [items, search]);

  useEffect(() => {
    if (!modal || (modal === "edit" && !editItem)) return undefined;
    void editors.setup(formRef.current, (message = "", error = false) => setModalStatus({ message, error }));
    return () => editors.destroy();
  }, [modal, editItem]);
  const close = () => { setModal(""); setEditItem(null); setModalStatus({ message: "", error: false }); setBusy(false); editors.destroy(); };
  const openEdit = async (listItem) => {
    setModal("edit"); setEditItem(null); setModalStatus({ message: "Loading details...", error: false });
    try { const response = await fetchCmsProgrammeDetail(listItem.department || ""); const item = response.data?.item; if (!item) throw new Error("Programme record not found."); setEditItem(item); setModalStatus({ message: "", error: false }); }
    catch (error) { const message = error.message || "Unable to load programme details."; setStatus({ message, error: true }); setModalStatus({ message, error: true }); }
  };
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setStatus({ message: modal === "edit" ? "Updating programme..." : "Uploading programme...", error: false }); setModalStatus({ message: "", error: false }); const data = new FormData(event.currentTarget); editors.syncToFormData(data);
    try { await (modal === "edit" ? updateCmsProgramme : createCmsProgramme)(data); setStatus({ message: "Upload done successfully.", error: false }); close(); refresh(); }
    catch (error) { const message = error.message || "Unable to save programme."; setStatus({ message, error: true }); setModalStatus({ message, error: true }); setBusy(false); }
  };
  const toggle = async (item) => {
    const action = Number(item.status || 0) === 1 ? "Disable" : "Enable"; setStatus({ message: `${action} programme...`, error: false });
    try { await toggleCmsProgramme(item.department || ""); setStatus({ message: "Programme status updated successfully.", error: false }); refresh(); } catch (error) { setStatus({ message: error.message || "Unable to update programme status.", error: true }); }
  };

  return <AdminShell activeKey="academics" activeChildKey="academics-programmes" heroTitle="Academic Page" heroLead="Edit the Academic / Programme"><div className="head-carol admin-legacy-shell__section-head"><h4 className="hd" id="overview">Programmes</h4><button type="button" className="admin-legacy-shell__add-trigger mb-2" onClick={() => { setModal("add"); setModalStatus({ message: "", error: false }); }}><i className="fas fa-plus"></i> Add Course</button></div><Banner value={status.message} error={status.error} /><form className="admin-legacy-shell__upload-form admin-legacy-shell__upload-form--search"><label htmlFor="cms-programme-search"><h3>Search by Course</h3></label><input id="cms-programme-search" type="text" placeholder="E.g. English" value={search} onChange={(event) => setSearch(event.target.value)} /></form><div className="admin-legacy-shell__table-wrap"><table className="admin-legacy-shell__table"><thead><tr><th>Department</th><th>Faculty</th><th>Degree</th><th>Edit</th><th>Enable / Disable</th></tr></thead><tbody>{filtered.length ? filtered.map((item) => { const enabled = Number(item.status || 0) === 1; return <tr key={item.department}><td>{item.department}</td><td>{item.faculty || "-"}</td><td>{(item.degrees || []).join(", ")}</td><td><button type="button" className="admin-legacy-shell__btn admin-legacy-shell__btn--update" onClick={() => void openEdit(item)}>Edit</button></td><td><button type="button" className={`admin-legacy-shell__btn ${enabled ? "admin-legacy-shell__btn--delete" : "admin-legacy-shell__btn--update"}`} onClick={() => void toggle(item)}>{enabled ? "Disable" : "Enable"}</button></td></tr>; }) : <tr><td colSpan="5"><p className="admin-legacy-shell__empty">No programmes found yet.</p></td></tr>}</tbody></table></div>{modal ? <Modal title={modal === "edit" ? "Edit Programme" : "Add Programme"} onClose={close}>{modal === "edit" && !editItem ? <Banner value={modalStatus.message} error={modalStatus.error} /> : <ProgrammeForm item={modal === "edit" ? editItem : null} options={options} formRef={formRef} onSubmit={(event) => void submit(event)} onClose={close} status={modalStatus} busy={busy} />}</Modal> : null}</AdminShell>;
}
