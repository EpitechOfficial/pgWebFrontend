import HomePage, { loadHomePage } from "../pages/HomePage.jsx";
import { AdmissionsAfterPage, AdmissionsGuidePage, AdmissionsPage, loadAdmissionsContent } from "../pages/AdmissionsPages.jsx";
import AcademicsPage, { loadAcademicsPage } from "../pages/AcademicsPage.jsx";
import { FeesPage, InternationalStudentsPage, loadFeesPage, loadInternationalStudentsPage } from "../pages/FeesPages.jsx";
import FormsPage, { loadFormsPage } from "../pages/FormsPage.jsx";
import { InternationalFeePage, InternationalFeeResultPage, SetupFeePage, SetupFeeResultPage, loadInternationalFeePage, loadInternationalFeeResultPage, loadSetupFeePage, loadSetupFeeResultPage } from "../pages/FeeCheckerPages.jsx";
import { AboutPage, ContactPage, SectionalHeadsPage, WhyPage, loadAboutPage, loadContactPage, loadSectionalHeadsPage, loadWhyPage } from "../pages/InformationPages.jsx";
import { NetworkErrorPage, NotFoundPage, loadFallbackPage } from "../pages/FallbackPages.jsx";
import ResearchAreasPage, { loadResearchAreasPage } from "../pages/ResearchAreasPage.jsx";
import ResearchAreasResultsPage, { loadResearchAreasResultsPage } from "../pages/ResearchAreasResultsPage.jsx";
import { MasterProgramPage, PostgraduateProgramPage, loadMasterProgramPage, loadPostgraduateProgramPage } from "../pages/ProgrammeDetailPage.jsx";
import ProgramOverviewPage, { loadProgramOverviewPage } from "../pages/ProgramOverviewPage.jsx";
import ProgrammesPage, { loadProgrammesPage } from "../pages/ProgrammesPage.jsx";

export const publicRoutes = {
  "/": {
    title: "The Postgraduate College",
    load: loadHomePage,
    component: HomePage
  },
  "/admissions": {
    title: "Admissions | The Postgraduate College",
    load: loadAdmissionsContent,
    component: AdmissionsPage
  },
  "/admissions/guide": {
    title: "Application Guide | The Postgraduate College",
    load: loadAdmissionsContent,
    component: AdmissionsGuidePage
  },
  "/admissions/after": {
    title: "After You Apply | The Postgraduate College",
    load: loadAdmissionsContent,
    component: AdmissionsAfterPage
  },
  "/academics": {
    title: "Academics | The Postgraduate College",
    load: loadAcademicsPage,
    component: AcademicsPage
  },
  "/why": {
    title: "Why Us | The Postgraduate College",
    load: loadWhyPage,
    component: WhyPage
  },
  "/areas": {
    title: "Research Areas | The Postgraduate College",
    load: loadResearchAreasPage,
    component: ResearchAreasPage
  },
  "/areas-list": {
    title: "Research Area Results | The Postgraduate College",
    load: loadResearchAreasResultsPage,
    component: ResearchAreasResultsPage
  },
  "/programmes": {
    title: "Programmes | The Postgraduate College",
    load: loadProgrammesPage,
    component: ProgrammesPage
  },
  "/program": {
    title: "Programme Overview | The Postgraduate College",
    load: loadProgramOverviewPage,
    component: ProgramOverviewPage
  },
  "/masterprogram": {
    title: "Master Programme | The Postgraduate College",
    load: loadMasterProgramPage,
    component: MasterProgramPage
  },
  "/postgraduateprogram": {
    title: "Postgraduate Programme | The Postgraduate College",
    load: loadPostgraduateProgramPage,
    component: PostgraduateProgramPage
  },
  "/fees": {
    title: "Fees | The Postgraduate College",
    load: loadFeesPage,
    component: FeesPage
  },
  "/setup_fee": {
    title: "Fee Checker | The Postgraduate College",
    load: loadSetupFeePage,
    component: SetupFeePage
  },
  "/setup_fee/result": {
    title: "Fee Breakdown | The Postgraduate College",
    load: loadSetupFeeResultPage,
    component: SetupFeeResultPage
  },
  "/intl_fee": {
    title: "International Fee Checker | The Postgraduate College",
    load: loadInternationalFeePage,
    component: InternationalFeePage
  },
  "/intl_fee/result": {
    title: "International Fee Breakdown | The Postgraduate College",
    load: loadInternationalFeeResultPage,
    component: InternationalFeeResultPage
  },
  "/foreign-student": {
    title: "International Student | The Postgraduate College",
    load: loadInternationalStudentsPage,
    component: InternationalStudentsPage
  },
  "/forms": {
    title: "Forms | The Postgraduate College",
    load: loadFormsPage,
    component: FormsPage
  },
  "/contact": {
    title: "Contact | The Postgraduate College",
    load: loadContactPage,
    component: ContactPage
  },
  "/about": {
    title: "About | The Postgraduate College",
    load: loadAboutPage,
    component: AboutPage
  },
  "/head": {
    title: "Sectional Heads | The Postgraduate College",
    load: loadSectionalHeadsPage,
    component: SectionalHeadsPage
  },
  "__notFound": {
    title: "404 | The Postgraduate College",
    load: loadFallbackPage,
    component: NotFoundPage
  },
  "__networkError": {
    title: "Network Error | The Postgraduate College",
    load: loadFallbackPage,
    component: NetworkErrorPage
  }
};
