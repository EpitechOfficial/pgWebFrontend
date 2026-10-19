import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LegacyContentPanel, LegacyPageHero, LegacySidebarNav } from "../components/LegacyPageLayout.jsx";
import { getAcademicsSidebarItems } from "../components/academicsSidebarItems.js";
import { fetchProgrammes } from "../services/site.js";
import { resolveImage } from "../utils/siteContent.js";

function programmeQuery() {
  const params = new URLSearchParams(window.location.search);
  return { page: Number(params.get("page") || 1), search: params.get("search") || "" };
}

function programmesHref(page, search) {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  return `/programmes?${params.toString()}`;
}

export async function loadProgrammesPage() {
  const query = programmeQuery();
  const response = await fetchProgrammes(query.page, query.search);
  return { ...response.data, query };
}

export default function ProgrammesPage({ model }) {
  const navigate = useNavigate();
  const academic = model.academic || {};
  const items = model.items || [];
  const pagination = model.pagination || {};
  const page = pagination.page || 1;
  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.totalItems || 0;
  const search = model.search || "";
  const [searchInput, setSearchInput] = useState(search);
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);
  const pageNumbers = Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, index) => startPage + index);
  const submit = (event) => {
    event.preventDefault();
    navigate(programmesHref(1, searchInput.trim()));
  };

  return <div className="programmes-page" data-programmes-page>
    <LegacyPageHero id="con" pageClass="programmes-page__hero" backgroundImage={resolveImage(academic.image)} title="A-Z List of Fields of Study" />
    <section id="doc" className="programmes-page__doc"><div className="container"><div className="doc-page">
      <LegacySidebarNav items={getAcademicsSidebarItems("programmes")} />
      <LegacyContentPanel pageClass="programmes-page__content-card">
        <h2 className="text-center">List of Postgraduate Courses</h2>
        <p className="mb">Below is the full list of all courses in Postgraduate college with the duration and degree to be awarded.</p>
        <form className="programmes-page__search" data-programmes-search-form onSubmit={submit}><input type="text" name="search" placeholder="Enter Keywords" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} /><button type="submit" className="s-btn">Search</button>{search ? <a href="/programmes?page=1" data-link className="programmes-page__clear">Clear</a> : null}</form>
        <table className="table" id="myTable"><tbody><tr className="head"><th>Department</th><th>Degree</th></tr>{items.map((item, index) => {
          const href = `/program?department=${encodeURIComponent(item.department || "")}`;
          return <tr className="clickable programmes-page__row" data-programmes-row={href} onClick={(event) => { if (!event.target.closest("a")) navigate(href); }} key={`${item.department}-${index}`}><td><a href={href} data-link>{item.department || ""}</a></td><td className="deg"><a href={href} data-link>{(item.degrees || []).join(" / ")}</a></td></tr>;
        })}</tbody></table>
        <div className="programmes-page__pagination">{page > 1 ? <><a href={programmesHref(1, search)} data-link>First</a><a href={programmesHref(page - 1, search)} data-link>Previous</a></> : null}{startPage > 1 ? <span>...</span> : null}{pageNumbers.map((pageNumber) => <a href={programmesHref(pageNumber, search)} data-link className={pageNumber === page ? "is-current" : ""} key={pageNumber}>{pageNumber}</a>)}{endPage < totalPages ? <span>...</span> : null}{page < totalPages ? <><a href={programmesHref(page + 1, search)} data-link>Next</a><a href={programmesHref(totalPages, search)} data-link>Last</a></> : null}</div>
        <div className="programmes-page__summary">Page {page} of {totalPages} (Total: {totalItems} departments{search ? ` matching "${search}"` : ""})</div>
      </LegacyContentPanel>
    </div></div></section>
  </div>;
}
