import { useEffect, useRef, useState } from "react";
import AdminShell from "../../components/Admin/AdminShell.jsx";
import { fetchCmsAcademicsContent, updateCmsAcademicsContent, updateCmsAcademicsImage } from "../../services/site.js";
import { loadCmsPageContent } from "../../utils/cmsPage.js";
import { createRichTextManager } from "../../utils/cmsRichText.js";

const editors = createRichTextManager({ selector: ".all", styleId: "pgc-froala-style", scriptId: "pgc-froala-script", editorOptions: { heightMin: 220 } });
const refresh = () => window.dispatchEvent(new PopStateEvent("popstate"));

function Banner({ status }) {
  return status.message ? <div className={`admin-legacy-shell__info-banner${status.error ? " is-error" : " is-success"}`}>{status.message}</div> : null;
}

export async function loadAcademicsCmsPage() {
  return loadCmsPageContent(fetchCmsAcademicsContent);
}

export default function AcademicsOverviewCmsPage({ model }) {
  const academic = model.academic || {};
  const contentForm = useRef(null);
  const [imageModal, setImageModal] = useState(false);
  const [imageStatus, setImageStatus] = useState({ message: "Update the academics background image used on the public page.", error: false });
  const [contentStatus, setContentStatus] = useState({ message: "Update the intro heading, intro content, and finder content for the Academics page.", error: false });
  const [modalStatus, setModalStatus] = useState({ message: "", error: false });
  const [imageBusy, setImageBusy] = useState(false);
  const [contentBusy, setContentBusy] = useState(false);

  useEffect(() => {
    void editors.setup(contentForm.current, (message = "", error = false) => setContentStatus({ message, error }));
    return () => editors.destroy();
  }, []);

  const submitImage = async (event) => {
    event.preventDefault(); setImageBusy(true); setImageStatus({ message: "Uploading academics background...", error: false }); setModalStatus({ message: "", error: false });
    try { await updateCmsAcademicsImage(new FormData(event.currentTarget)); setImageStatus({ message: "Image upload done successfully.", error: false }); setImageModal(false); refresh(); }
    catch (error) { const message = error.message || "Unable to upload the image."; setImageStatus({ message, error: true }); setModalStatus({ message, error: true }); setImageBusy(false); }
  };
  const submitContent = async (event) => {
    event.preventDefault(); setContentBusy(true); setContentStatus({ message: "Updating academics content...", error: false }); const data = new FormData(event.currentTarget); editors.syncToFormData(data);
    try { await updateCmsAcademicsContent(data); setContentStatus({ message: "Upload done successfully.", error: false }); refresh(); }
    catch (error) { setContentStatus({ message: error.message || "Unable to update the academics content.", error: true }); setContentBusy(false); }
  };

  return <AdminShell activeKey="academics" activeChildKey="academics-overview" heroTitle="Academic Page" heroLead="Edit the academic page">
    <div className="head-carol admin-legacy-shell__section-head"><h4 className="hd" id="overview">Background</h4><button type="button" className="admin-legacy-shell__add-trigger mb-2" onClick={() => { setImageModal(true); setModalStatus({ message: "", error: false }); }}><i className="fas fa-edit"></i> Change image</button></div>
    <Banner status={imageStatus} />
    <article className="admin-legacy-shell__speech-card"><div className="admin-legacy-shell__speech-image">{academic.image ? <img src={`/image/${encodeURIComponent(academic.image)}`} alt="Academic background" /> : <div className="admin-legacy-shell__speech-placeholder">No background image uploaded</div>}</div></article>
    <div className="head-carol admin-legacy-shell__section-head"><h4 className="hd">Content</h4></div><Banner status={contentStatus} />
    <form ref={contentForm} className="admin-legacy-shell__upload-form" onSubmit={(event) => void submitContent(event)}><div className="form-group"><label htmlFor="cms-academic-head">Intro Head:</label><input id="cms-academic-head" type="text" name="introHead" defaultValue={academic.head || ""} required /></div><div className="form-group"><label htmlFor="cms-academic-intro">Intro Content:</label><textarea className="all" id="cms-academic-intro" name="headCon" rows="8" required defaultValue={academic.intro || ""} /></div><div className="form-group"><label htmlFor="cms-academic-finder">Finder Content:</label><textarea className="all" id="cms-academic-finder" name="finderCon" rows="8" required defaultValue={academic.finder || ""} /></div><div className="admin-legacy-shell__upload-actions"><button type="submit" className="admin-legacy-shell__add-trigger" disabled={contentBusy}>{contentBusy ? "Uploading..." : "Upload"}</button></div></form>
    {imageModal ? <div className="admin-legacy-shell__modal"><div className="admin-legacy-shell__modal-backdrop" onClick={() => setImageModal(false)}></div><div className="admin-legacy-shell__modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cms-academics-image-title"><div className="admin-legacy-shell__modal-header"><h5 id="cms-academics-image-title">Change Academics Background</h5><button type="button" className="admin-legacy-shell__modal-close" onClick={() => setImageModal(false)} aria-label="Close"><span aria-hidden="true">&times;</span></button></div><form className="admin-legacy-shell__upload-form admin-legacy-shell__upload-form--modal" onSubmit={(event) => void submitImage(event)}><Banner status={modalStatus} /><div className="form-group"><label htmlFor="cms-academic-image-file">Choose image:</label><input id="cms-academic-image-file" type="file" name="uploadfile" accept=".png,.jpg,.jpeg" required /></div><div className="admin-legacy-shell__upload-actions"><button type="button" className="admin-legacy-shell__btn admin-legacy-shell__btn--cancel" onClick={() => setImageModal(false)}>Close</button><button type="submit" className="admin-legacy-shell__add-trigger" disabled={imageBusy}>{imageBusy ? "Uploading..." : "Upload"}</button></div></form></div></div> : null}
  </AdminShell>;
}
