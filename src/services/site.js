import { getJson, postFormData, postJson } from "./api.js";

export function fetchHomeContent() {
  return getJson("/api/site/home");
}

export function fetchStatistics(session) {
  const params = new URLSearchParams({ session });
  return getJson(`/api/site/statistics?${params.toString()}`);
}

export function fetchContactContent() {
  return getJson("/api/site/contact");
}

export function fetchAcademicsContent() {
  return getJson("/api/site/academics");
}

export function fetchAdmissionsContent() {
  return getJson("/api/site/admissions");
}

export function fetchWhyContent() {
  return getJson("/api/site/why");
}

export function fetchResearchAreasContent() {
  return getJson("/api/site/research-areas");
}

export function fetchResearchAreaOptions(facultyId) {
  const params = new URLSearchParams({ facultyId: String(facultyId) });
  return getJson(`/api/site/research-areas/options?${params.toString()}`);
}

export function fetchResearchAreaResults(facultyId, departmentId, degreeId) {
  const params = new URLSearchParams({
    facultyId: String(facultyId),
    departmentId: String(departmentId),
    degreeId: String(degreeId)
  });
  return getJson(`/api/site/research-areas/results?${params.toString()}`);
}

export function fetchProgrammeDetail(department) {
  const params = new URLSearchParams({ department });
  return getJson(`/api/site/programme-detail?${params.toString()}`);
}

export function fetchProgrammes(page = 1, search = "") {
  const params = new URLSearchParams({ page: String(page) });

  if (search) {
    params.set("search", search);
  }

  return getJson(`/api/site/programmes?${params.toString()}`);
}

export function fetchProgrammeOverview(department) {
  const params = new URLSearchParams({ department });
  return getJson(`/api/site/programme-overview?${params.toString()}`);
}

export function fetchFeesContent() {
  return getJson("/api/site/fees");
}

export function fetchInternationalStudentsContent() {
  return getJson("/api/site/international-students");
}

export function fetchSetupFeeContent() {
  return getJson("/api/site/setup-fee");
}

export function fetchSetupFeeOptions(facultyId) {
  const params = new URLSearchParams({ facultyId: String(facultyId) });
  return getJson(`/api/site/setup-fee/options?${params.toString()}`);
}

export function fetchSetupFeeDegrees(departmentId) {
  const params = new URLSearchParams({ departmentId: String(departmentId) });
  return getJson(`/api/site/setup-fee/degrees?${params.toString()}`);
}

export function fetchSetupFeeCalculation({ facultyId, departmentId, degreeId, mode, type, paymentType, installmentType = "" }) {
  const params = new URLSearchParams({
    facultyId: String(facultyId),
    departmentId: String(departmentId),
    degreeId: String(degreeId),
    mode,
    type,
    paymentType
  });

  if (installmentType) {
    params.set("installmentType", installmentType);
  }

  return getJson(`/api/site/setup-fee/calculate?${params.toString()}`);
}

export function fetchInternationalFeeContent() {
  return getJson("/api/site/intl-fee");
}

export function fetchInternationalFeeCalculation({ facultyId, departmentId, degreeId, type }) {
  const params = new URLSearchParams({
    facultyId: String(facultyId),
    departmentId: String(departmentId),
    degreeId: String(degreeId),
    type
  });

  return getJson(`/api/site/intl-fee/calculate?${params.toString()}`);
}

export function loginCmsUser(username, password) {
  return postJson("/api/cms/login", { username, password });
}

export function fetchCmsCurrentUser() {
  return getJson("/api/cms/me");
}

export function fetchCmsHomeContent() {
  return getJson("/api/cms/home");
}

export function fetchCmsFlagshipProgrammesContent() {
  return getJson("/api/cms/home/flagship");
}

export function fetchCmsProvostSpeechContent() {
  return getJson("/api/cms/home/speech");
}

export function fetchCmsAcademicsContent() {
  return getJson("/api/cms/academics");
}

export function fetchCmsProgrammesContent() {
  return getJson("/api/cms/academics/programmes");
}

export function fetchCmsProgrammeDetail(department) {
  const params = new URLSearchParams({ department });
  return getJson(`/api/cms/academics/programmes/detail?${params.toString()}`);
}

export function fetchCmsFacilitiesContent() {
  return getJson("/api/cms/academics/facilities");
}

export function fetchCmsSupervisorsContent() {
  return getJson("/api/cms/academics/supervisors");
}

export function fetchCmsWhyContent() {
  return getJson("/api/cms/academics/why");
}

export function fetchCmsStudentSpeechesContent() {
  return getJson("/api/cms/academics/students");
}

export function fetchCmsFeesContent() {
  return getJson("/api/cms/academics/fees");
}

export function fetchCmsAdmissionsContent() {
  return getJson("/api/cms/admissions");
}

export function fetchCmsAdmissionsGuideContent() {
  return getJson("/api/cms/admissions/guide");
}

export function fetchCmsAdmissionsAfterContent() {
  return getJson("/api/cms/admissions/after");
}

export function fetchCmsInternationalContent() {
  return getJson("/api/cms/international");
}

export function fetchCmsContactContent() {
  return getJson("/api/cms/contact");
}

export function uploadCmsFormFile(formData) {
  return postFormData("/api/cms/forms/upload", formData);
}

export function createCmsCarousel(formData) {
  return postFormData("/api/cms/home/carousels", formData);
}

export function updateCmsCarousel(formData) {
  return postFormData("/api/cms/home/carousels/update", formData);
}

export function deleteCmsCarousel(id) {
  return postJson("/api/cms/home/carousels/delete", { id });
}

export function createCmsFlagshipProgram(formData) {
  return postFormData("/api/cms/home/flagship", formData);
}

export function updateCmsFlagshipProgram(formData) {
  return postFormData("/api/cms/home/flagship/update", formData);
}

export function deleteCmsFlagshipProgram(id) {
  return postJson("/api/cms/home/flagship/delete", { id });
}

export function updateCmsProvostSpeech(formData) {
  return postFormData("/api/cms/home/speech/update", formData);
}

export function updateCmsAcademicsImage(formData) {
  return postFormData("/api/cms/academics/image", formData);
}

export function updateCmsAcademicsContent(formData) {
  return postFormData("/api/cms/academics/content", formData);
}

export function createCmsProgramme(formData) {
  return postFormData("/api/cms/academics/programmes", formData);
}

export function updateCmsProgramme(formData) {
  return postFormData("/api/cms/academics/programmes/update", formData);
}

export function toggleCmsProgramme(department) {
  return postJson("/api/cms/academics/programmes/toggle", { department });
}

export function createCmsFacility(formData) {
  return postFormData("/api/cms/academics/facilities", formData);
}

export function updateCmsFacility(formData) {
  return postFormData("/api/cms/academics/facilities/update", formData);
}

export function deleteCmsFacility(id) {
  return postJson("/api/cms/academics/facilities/delete", { id });
}

export function createCmsSupervisor(formData) {
  return postFormData("/api/cms/academics/supervisors", formData);
}

export function updateCmsSupervisor(formData) {
  return postFormData("/api/cms/academics/supervisors/update", formData);
}

export function deleteCmsSupervisor(id) {
  return postJson("/api/cms/academics/supervisors/delete", { id });
}

export function updateCmsWhyContent(formData) {
  return postFormData("/api/cms/academics/why", formData);
}

export function createCmsStudentSpeech(formData) {
  return postFormData("/api/cms/academics/students", formData);
}

export function updateCmsStudentSpeech(formData) {
  return postFormData("/api/cms/academics/students/update", formData);
}

export function deleteCmsStudentSpeech(id) {
  return postJson("/api/cms/academics/students/delete", { id });
}

export function updateCmsFeesContent(formData) {
  return postFormData("/api/cms/academics/fees", formData);
}

export function updateCmsAdmissionsContent(formData) {
  return postFormData("/api/cms/admissions", formData);
}

export function updateCmsAdmissionsGuideContent(formData) {
  return postFormData("/api/cms/admissions/guide", formData);
}

export function updateCmsAdmissionsAfterContent(formData) {
  return postFormData("/api/cms/admissions/after", formData);
}

export function updateCmsInternationalContent(formData) {
  return postFormData("/api/cms/international", formData);
}

export function updateCmsContactContent(formData) {
  return postFormData("/api/cms/contact", formData);
}

export function logoutCmsUser() {
  return postJson("/api/cms/logout");
}

