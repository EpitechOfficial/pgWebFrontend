function getDepartmentMatch(departments, query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();

  if (!normalizedQuery) {
    return "";
  }

  const exactMatch = departments.find((department) => department.toLowerCase() === normalizedQuery);

  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = departments.find((department) => department.toLowerCase().includes(normalizedQuery));

  return partialMatch || "";
}

export { getDepartmentMatch };
