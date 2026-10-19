import { useEffect, useState } from "react";
import { LegacyContentPanel } from "../components/LegacyPageLayout.jsx";
import FeeResultPanel from "../components/FeeResultPanel.jsx";
import { fetchInternationalFeeCalculation, fetchInternationalFeeContent, fetchSetupFeeCalculation, fetchSetupFeeContent, fetchSetupFeeDegrees, fetchSetupFeeOptions } from "../services/site.js";

export async function loadSetupFeePage() { return (await fetchSetupFeeContent()).data; }
export async function loadInternationalFeePage() { return (await fetchInternationalFeeContent()).data; }

function FeeChecker({ model, international = false }) {
  const faculties = model.faculties || [];
  const [facultyId, setFacultyId] = useState(String(faculties[0]?.id || ""));
  const [departments, setDepartments] = useState([]); const [degrees, setDegrees] = useState([]);
  const [departmentId, setDepartmentId] = useState(""); const [degreeId, setDegreeId] = useState("");
  const [mode, setMode] = useState(""); const [type, setType] = useState(""); const [paymentType, setPaymentType] = useState(""); const [installmentType, setInstallmentType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let current = true; setDepartments([]); setDegrees([]); setDepartmentId(""); setDegreeId("");
    if (!facultyId) return () => { current = false; };
    setStatus("Loading departments and degrees...");
    void fetchSetupFeeOptions(facultyId).then((response) => { if (!current) return; setDepartments(response.data?.departments || []); setDegrees(response.data?.degrees || []); setStatus(""); }).catch((error) => { if (current) setStatus(error.message); });
    return () => { current = false; };
  }, [facultyId]);

  const changeDepartment = async (value) => {
    setDepartmentId(value); setDegreeId(""); if (!value) return;
    setStatus("Loading degrees...");
    try { const response = await fetchSetupFeeDegrees(value); setDegrees(response.data?.degrees || []); setStatus(""); } catch (error) { setStatus(error.message); }
  };
  const submit = (event) => {
    event.preventDefault();
    if (!facultyId || !departmentId || !degreeId || !type || (!international && (!mode || !paymentType))) { setStatus(international ? "Please complete all required international fee fields before searching." : "Please complete all required fee checker fields before searching."); return; }
    if (!international && paymentType === "install" && !installmentType) { setStatus("Please select an installment mode."); return; }
    const params = new URLSearchParams({ facultyId, departmentId, degreeId, type });
    if (!international) { params.set("mode", mode); params.set("paymentType", paymentType); if (installmentType) params.set("installmentType", installmentType); }
    window.open(`${international ? "/intl_fee/result" : "/setup_fee/result"}?${params.toString()}`, "_blank", "noopener,noreferrer");
  };
  const prefix = international ? "intl-fee" : "setup-fee";
  return <div className={`setup-fee-page${international ? " intl-fee-page" : ""}`} {...{ [`data-${prefix}-page`]: true }}><section className="setup-fee-page__section setup-fee-page__section--legacy"><div className="container"><LegacyContentPanel pageClass="setup-fee-page__content-card"><div className="setup-fee-page__box"><h6 className="setup-fee-page__title">{international ? "International Student Fee Checker" : "Fee Checker"}</h6><div id="feechecker" className="setup-fee-page__checker"><form onSubmit={submit}><div className="form-group"><label htmlFor={`${prefix}-faculty`}>Faculty</label><select id={`${prefix}-faculty`} value={facultyId} onChange={(event) => setFacultyId(event.target.value)} required>{faculties.map((item) => <option value={item.id} key={item.id}>{item.faculty}</option>)}</select></div><div className="setup-fee-page__dynamic"><div className="form-group"><label htmlFor={`${prefix}-department`}>Department</label><select id={`${prefix}-department`} value={departmentId} onChange={(event) => void changeDepartment(event.target.value)} required><option value="" disabled>Select Department</option>{departments.map((item) => <option value={item.id} key={item.id}>{item.department || ""}</option>)}</select></div><div className="form-group"><label htmlFor={`${prefix}-degree`}>Degree</label><select id={`${prefix}-degree`} value={degreeId} onChange={(event) => setDegreeId(event.target.value)} required><option value="" disabled>Select Degree</option>{degrees.map((item) => <option value={item.id} key={item.id}>{item.degree || ""}</option>)}</select></div>{!international ? <><div className="form-group"><label htmlFor="setup-fee-mode">Mode</label><select id="setup-fee-mode" value={mode} onChange={(event) => setMode(event.target.value)} required><option value="" disabled>Select Mode</option><option value="Full Time">Full Time</option><option value="Part Time">Part Time</option></select></div><div className="form-group"><label htmlFor="setup-fee-type">Type</label><select id="setup-fee-type" value={type} onChange={(event) => setType(event.target.value)} required><option value="" disabled>Select Type</option><option value="New">New</option><option value="Renewal">Renewal</option></select></div><div className="form-group"><label htmlFor="setup-fee-ptype">Payment Type</label><select id="setup-fee-ptype" value={paymentType} onChange={(event) => { setPaymentType(event.target.value); if (event.target.value !== "install") setInstallmentType(""); }} required><option value="" disabled>Select Payment Type</option><option value="full">Full-Payment</option><option value="install">Installmental Payment</option></select></div>{paymentType === "install" ? <div className="form-group"><label htmlFor="setup-fee-itype">Installmental Mode</label><select id="setup-fee-itype" value={installmentType} onChange={(event) => setInstallmentType(event.target.value)} required><option value="" disabled>Select Installmental Mode</option><option value="first">First Installment</option><option value="second">Second Installment</option></select></div> : null}</> : null}</div>{international ? <div className="form-group"><label htmlFor="intl-fee-type">Type</label><select id="intl-fee-type" value={type} onChange={(event) => setType(event.target.value)} required><option value="" disabled>Select Type</option><option value="New">New</option><option value="Renewal">Renewal</option></select></div> : null}<div className="setup-fee-page__status">{status}</div><input type="submit" value="Search" name="send" className="btn btn-dark setup-fee-page__submit" /></form></div></div></LegacyContentPanel></div></section></div>;
}

export function SetupFeePage({ model }) { return <FeeChecker model={model} />; }
export function InternationalFeePage({ model }) { return <FeeChecker model={model} international />; }

function query(keys) { const params = new URLSearchParams(window.location.search); return Object.fromEntries(keys.map((key) => [key, params.get(key) || ""])); }
export async function loadSetupFeeResultPage() { const values = query(["facultyId", "departmentId", "degreeId", "mode", "type", "paymentType", "installmentType"]); if (!values.facultyId || !values.departmentId || !values.degreeId || !values.mode || !values.type || !values.paymentType) throw new Error("Please start from the fee checker and complete all required selections."); return (await fetchSetupFeeCalculation(values)).data; }
export async function loadInternationalFeeResultPage() { const values = query(["facultyId", "departmentId", "degreeId", "type"]); if (!values.facultyId || !values.departmentId || !values.degreeId || !values.type) throw new Error("Please start from the international fee checker and complete all required selections."); return (await fetchInternationalFeeCalculation(values)).data; }

function FeeResult({ model, international }) {
  return <div className={`setup-fee-result-page${international ? " intl-fee-result-page" : ""}`} {...{ [international ? "data-intl-fee-result-page" : "data-setup-fee-result-page"]: true }}><section className="setup-fee-result-page__section setup-fee-result-page__section--legacy"><div className="container"><div className="setup-fee-result-page__header"><img src="/image/logo.png" className="logo" alt="The Postgraduate College logo" /><h1>The&nbsp;Postgraduate&nbsp;College</h1><h1>University of Ibadan</h1></div><FeeResultPanel faculty={model.faculty?.faculty || ""} department={model.department?.department || ""} mode={model.mode || (international ? "Full Time" : "")} degree={model.degree?.degree || ""} type={model.type || ""} paymentType={model.paymentType || (international ? "FULL" : "")} installmentType={model.installmentType || ""} items={model.items || []} total={model.total || 0} currency={international ? "$" : "N"} /></div></section></div>;
}
export function SetupFeeResultPage({ model }) { return <FeeResult model={model} international={false} />; }
export function InternationalFeeResultPage({ model }) { return <FeeResult model={model} international />; }
