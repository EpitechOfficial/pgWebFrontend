import { getAcademicsSidebarItems } from "./academicsSidebarItems.js";

export function getAdmissionsSidebarItems(currentSubsection = "") {
  const items = getAcademicsSidebarItems();
  const admissionsIndex = items.findIndex((item) => item.key === "admissions");

  if (admissionsIndex === -1) {
    return items;
  }

  const nextItems = [...items];
  nextItems[admissionsIndex] = {
    ...nextItems[admissionsIndex],
    className: "sup-active"
  };

  const subItems = [
    {
      href: "/admissions/guide",
      label: "Application&nbsp;Guide",
      className: currentSubsection === "guide" ? "sub-active" : "",
      internal: true
    },
    {
      href: "/admissions/after",
      label: "After&nbsp;Application",
      className: currentSubsection === "after" ? "sub-active" : "",
      internal: true
    }
  ];

  nextItems.splice(admissionsIndex + 1, 0, ...subItems);

  return nextItems;
}
