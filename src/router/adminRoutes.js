import { CmsDashboardPage, CmsLoginPage, loadCmsDashboardPage, loadCmsLoginPage } from "../pages/Admin/CmsCorePages.jsx";
import { ExternalLinksCmsPage, SectionalHeadsCmsPage, loadExternalLinksCmsPage, loadSectionalHeadsCmsPage } from "../pages/Admin/SiteSettingsCmsPages.jsx";
import { FlagshipProgrammesCmsPage, HomeCmsPage, ProvostSpeechCmsPage, loadFlagshipProgrammesCmsPage, loadHomeCmsPage, loadProvostSpeechCmsPage } from "../pages/Admin/HomeCmsPages.jsx";
import AcademicsOverviewCmsPage, { loadAcademicsCmsPage } from "../pages/Admin/AcademicsOverviewCmsPage.jsx";
import ProgrammesCmsPage, { loadProgrammesCmsPage } from "../pages/Admin/ProgrammesCmsPage.jsx";
import { FacilitiesCmsPage, SupervisorsCmsPage, loadFacilitiesCmsPage, loadSupervisorsCmsPage } from "../pages/Admin/AcademicCollectionsCmsPages.jsx";
import { FeesCmsPage, StudentSpeechCmsPage, WhyCmsPage, loadFeesCmsPage, loadStudentSpeechCmsPage, loadWhyCmsPage } from "../pages/Admin/AcademicContentCmsPages.jsx";
import { AdmissionsAfterCmsPage, AdmissionsCmsPage, AdmissionsGuideCmsPage, loadAdmissionsAfterCmsPage, loadAdmissionsCmsPage, loadAdmissionsGuideCmsPage } from "../pages/Admin/AdmissionsCmsPages.jsx";
import { ContactCmsPage, InternationalCmsPage, loadContactCmsPage, loadInternationalCmsPage } from "../pages/Admin/GeneralCmsPages.jsx";

export const adminRoutes = {
  "/cms/login": {
    title: "CMS Login | The Postgraduate College",
    load: loadCmsLoginPage,
    component: CmsLoginPage
  },
  "/cms": {
    title: "CMS | The Postgraduate College",
    load: loadCmsDashboardPage,
    component: CmsDashboardPage
  },
  "/cms/home": {
    title: "Home CMS | The Postgraduate College",
    load: loadHomeCmsPage,
    component: HomeCmsPage
  },
  "/cms/home/flagship": {
    title: "Flagship Programmes CMS | The Postgraduate College",
    load: loadFlagshipProgrammesCmsPage,
    component: FlagshipProgrammesCmsPage
  },
  "/cms/home/speech": {
    title: "Provost Speech CMS | The Postgraduate College",
    load: loadProvostSpeechCmsPage,
    component: ProvostSpeechCmsPage
  },
  "/cms/academics": {
    title: "Academics CMS | The Postgraduate College",
    load: loadAcademicsCmsPage,
    component: AcademicsOverviewCmsPage
  },
  "/cms/academics/programmes": {
    title: "Programmes CMS | The Postgraduate College",
    load: loadProgrammesCmsPage,
    component: ProgrammesCmsPage
  },
  "/cms/academics/facilities": {
    title: "Facilities CMS | The Postgraduate College",
    load: loadFacilitiesCmsPage,
    component: FacilitiesCmsPage
  },
  "/cms/academics/supervisors": {
    title: "Supervisors CMS | The Postgraduate College",
    load: loadSupervisorsCmsPage,
    component: SupervisorsCmsPage
  },
  "/cms/academics/why": {
    title: "Why CMS | The Postgraduate College",
    load: loadWhyCmsPage,
    component: WhyCmsPage
  },
  "/cms/academics/students": {
    title: "Student Speech CMS | The Postgraduate College",
    load: loadStudentSpeechCmsPage,
    component: StudentSpeechCmsPage
  },
  "/cms/academics/fees": {
    title: "Fees CMS | The Postgraduate College",
    load: loadFeesCmsPage,
    component: FeesCmsPage
  },
  "/cms/admissions": {
    title: "Admissions CMS | The Postgraduate College",
    load: loadAdmissionsCmsPage,
    component: AdmissionsCmsPage
  },
  "/cms/admissions/guide": {
    title: "Admissions Guide CMS | The Postgraduate College",
    load: loadAdmissionsGuideCmsPage,
    component: AdmissionsGuideCmsPage
  },
  "/cms/admissions/after": {
    title: "After Application CMS | The Postgraduate College",
    load: loadAdmissionsAfterCmsPage,
    component: AdmissionsAfterCmsPage
  },
  "/cms/international": {
    title: "International CMS | The Postgraduate College",
    load: loadInternationalCmsPage,
    component: InternationalCmsPage
  },
  "/cms/contact": {
    title: "Contact CMS | The Postgraduate College",
    load: loadContactCmsPage,
    component: ContactCmsPage
  },
  "/cms/sectional-heads": {
    title: "Sectional Heads CMS | The Postgraduate College",
    load: loadSectionalHeadsCmsPage,
    component: SectionalHeadsCmsPage
  },
  "/cms/external-links": {
    title: "External Links CMS | The Postgraduate College",
    load: loadExternalLinksCmsPage,
    component: ExternalLinksCmsPage
  }
};
