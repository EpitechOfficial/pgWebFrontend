const sidebarConfig = [
  { key: "home", href: "/", label: "Home", icon: "fa-chevron-left", className: "als", internal: true },
  { key: "academics", href: "/academics", label: "Academics", icon: "fa-chevron-down", internal: true },
  { key: "why", href: "/why", label: "Why&nbsp;Us", internal: true },
  { key: "areas", href: "/areas", label: "Research&nbsp;Areas", internal: true },
  { key: "programmes", href: "/programmes", label: "Programmes", internal: true },
  { key: "foreign-student", href: "/foreign-student", label: "Foreign Students", internal: true },
  { key: "admissions", href: "/admissions", label: "Admissions", internal: true },
  { key: "fees", href: "/fees", label: "Fees & Funding", internal: true },
  { key: "contact", href: "/contact", label: "Contact Us", internal: true }
];

export function getAcademicsSidebarItems(currentSection = "") {
  return sidebarConfig.map((item) => {
    if (item.key === "academics") {
      return {
        ...item,
        active: true
      };
    }

    if (item.key === currentSection) {
      return {
        ...item,
        className: "sub-active"
      };
    }

    return { ...item };
  });
}
