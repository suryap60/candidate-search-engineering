import type { Candidate } from "../types/candidate";
import { formatDateTime } from "../utils/date";

interface CandidateTableProps {
  candidates: Candidate[];
  loading: boolean;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange: (column: string) => void;
}

export default function CandidateTable({
  candidates,
  loading,
  hasActiveFilters,
  onResetFilters,
  sortBy,
  sortOrder,
  onSortChange,
}: CandidateTableProps) {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  const getGenderBadgeClass = (gender: string) => {
    const g = gender.toLowerCase();
    if (g === "male") return "badge-gender-male";
    if (g === "female") return "badge-gender-female";
    return "badge-gender-other";
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="table-wrapper" id="candidates-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th
              className="sortable"
              onClick={() => onSortChange("age")}
              title="Click to sort by Age"
            >
              Age
              <span className="sort-indicator">{getSortIcon("age")}</span>
            </th>
            <th>Gender</th>
            <th>Education</th>
            <th>Location</th>
            <th
              className="sortable"
              onClick={() => onSortChange("createdAt")}
              title="Click to sort by Created Date"
            >
              Created At
              <span className="sort-indicator">{getSortIcon("createdAt")}</span>
            </th>
            <th
              className="sortable"
              onClick={() => onSortChange("lastLoginAt")}
              title="Click to sort by Last Login"
            >
              Last Login
              <span className="sort-indicator">{getSortIcon("lastLoginAt")}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Skeleton loading state */}
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <tr key={`skeleton-${index}`}>
                <td>
                  <div className="candidate-name-cell">
                    <div className="skeleton skeleton-circle"></div>
                    <div style={{ flex: 1 }}>
                      <div className="skeleton skeleton-text" style={{ width: "140px", marginBottom: "6px" }}></div>
                      <div className="skeleton skeleton-text" style={{ width: "60px", height: "12px" }}></div>
                    </div>
                  </div>
                </td>
                <td><div className="skeleton skeleton-text" style={{ width: "30px" }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: "60px" }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: "70px" }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: "80px" }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: "130px" }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: "130px" }}></div></td>
              </tr>
            ))
          ) : candidates.length === 0 ? (
            /* Empty state */
            <tr>
              <td colSpan={7}>
                <div className="state-container">
                  <div className="state-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                  <h3 className="state-title">
                    {hasActiveFilters ? "No matching candidates found" : "No candidates available"}
                  </h3>
                  <p className="state-subtitle">
                    {hasActiveFilters
                      ? "No candidates match the selected filters. Try broadening your filter criteria or clearing them."
                      : "There are currently no candidates in the database."}
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onResetFilters}
                      style={{ marginTop: "8px" }}
                      id="clear-filters-empty-state-btn"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            /* Render actual candidate rows */
            candidates.map((candidate) => (
              <tr key={candidate.id} id={`candidate-row-${candidate.id}`}>
                <td>
                  <div className="candidate-name-cell">
                    <div className="candidate-avatar">
                      {getInitials(candidate.name)}
                    </div>
                    <div>
                      <div className="candidate-name-text">{candidate.name}</div>
                      {/* <div className="candidate-id">ID: #{candidate.id}</div> */}
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{candidate.age}</strong> yrs
                </td>
                <td>
                  <span className={`badge ${getGenderBadgeClass(candidate.gender)}`}>
                    {candidate.gender}
                  </span>
                </td>
                <td>
                  <span className="badge badge-education">
                    {candidate.education}
                  </span>
                </td>
                <td>
                  <span className="location-tag">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#9ca3af">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {candidate.location}
                  </span>
                </td>
                <td>
                  <span className="date-text">{formatDateTime(candidate.createdAt)}</span>
                </td>
                <td>
                  {candidate.lastLoginAt ? (
                    <span className="date-text">{formatDateTime(candidate.lastLoginAt)}</span>
                  ) : (
                    <span className="date-never">Never</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
