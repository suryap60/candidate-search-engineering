import type { FormEvent } from "react";
import type { CandidateSearchParams } from "../types/candidate";

interface SearchFiltersProps {
  filters: CandidateSearchParams;
  onFilterChange: (key: keyof CandidateSearchParams, value: string | number | undefined) => void;
  onEducationToggle: (edu: string) => void;
  onSearch: (e?: FormEvent) => void;
  onReset: () => void;
  loading: boolean;
}

const COMMON_EDUCATIONS = [
  "B.Tech",
  "M.Tech",
  "MBA",
  "BCA",
  "MCA",
  "B.Sc",
  "M.Sc",
  "PhD",
];

export default function SearchFilters({
  filters,
  onFilterChange,
  onEducationToggle,
  onSearch,
  onReset,
  loading,
}: SearchFiltersProps) {
  const selectedEducations = filters.education
    ? filters.education.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(e);
  };

  return (
    <div className="card">
      <div className="filter-header">
        <h2 className="filter-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#818cf8">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Search & Filter Candidates
        </h2>
      </div>

      <form onSubmit={handleSubmit} id="search-filter-form">
        <div className="filter-grid">
          {/* Min Age */}
          <div className="form-group">
            <label className="form-label" htmlFor="min-age-input">Min Age</label>
            <input
              id="min-age-input"
              type="number"
              min="0"
              max="120"
              placeholder="e.g. 21"
              className="form-input"
              value={filters.minAge ?? ""}
              onChange={(e) => onFilterChange("minAge", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Max Age */}
          <div className="form-group">
            <label className="form-label" htmlFor="max-age-input">Max Age</label>
            <input
              id="max-age-input"
              type="number"
              min="0"
              max="120"
              placeholder="e.g. 45"
              className="form-input"
              value={filters.maxAge ?? ""}
              onChange={(e) => onFilterChange("maxAge", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label" htmlFor="gender-select">Gender</label>
            <select
              id="gender-select"
              className="form-select"
              value={filters.gender || "All"}
              onChange={(e) => onFilterChange("gender", e.target.value === "All" ? undefined : e.target.value)}
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location-input">Location</label>
            <input
              id="location-input"
              type="text"
              placeholder="e.g. Kochi, Bangalore"
              className="form-input"
              value={filters.location ?? ""}
              onChange={(e) => onFilterChange("location", e.target.value ? e.target.value.toLowerCase() : undefined)}
            />
          </div>

          {/* Created From */}
          <div className="form-group">
            <label className="form-label" htmlFor="created-from-input">Created From</label>
            <input
              id="created-from-input"
              type="date"
              className="form-input"
              value={filters.createdFrom ? filters.createdFrom.split("T")[0] : ""}
              onChange={(e) => onFilterChange("createdFrom", e.target.value || undefined)}
            />
          </div>

          {/* Created To */}
          <div className="form-group">
            <label className="form-label" htmlFor="created-to-input">Created To</label>
            <input
              id="created-to-input"
              type="date"
              className="form-input"
              value={filters.createdTo ? filters.createdTo.split("T")[0] : ""}
              onChange={(e) => onFilterChange("createdTo", e.target.value || undefined)}
            />
          </div>

          {/* Last Login From */}
          <div className="form-group">
            <label className="form-label" htmlFor="last-login-from-input">Last Login From</label>
            <input
              id="last-login-from-input"
              type="date"
              className="form-input"
              value={filters.lastLoginFrom ? filters.lastLoginFrom.split("T")[0] : ""}
              onChange={(e) => onFilterChange("lastLoginFrom", e.target.value || undefined)}
            />
          </div>

          {/* Last Login To */}
          <div className="form-group">
            <label className="form-label" htmlFor="last-login-to-input">Last Login To</label>
            <input
              id="last-login-to-input"
              type="date"
              className="form-input"
              value={filters.lastLoginTo ? filters.lastLoginTo.split("T")[0] : ""}
              onChange={(e) => onFilterChange("lastLoginTo", e.target.value || undefined)}
            />
          </div>

          {/* Sort By */}
          <div className="form-group">
            <label className="form-label" htmlFor="sort-by-select">Sort By</label>
            <select
              id="sort-by-select"
              className="form-select"
              value={filters.sortBy || "createdAt"}
              onChange={(e) => onFilterChange("sortBy", e.target.value || undefined)}
            >
              <option value="createdAt">Created At</option>
              <option value="lastLoginAt">Last Login</option>
              <option value="age">Age</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="form-group">
            <label className="form-label" htmlFor="sort-order-select">Sort Order</label>
            <select
              id="sort-order-select"
              className="form-select"
              value={filters.sortOrder || "desc"}
              onChange={(e) => onFilterChange("sortOrder", e.target.value || undefined)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Education Multi-Select */}
          <div className="form-group filter-group-wide">
            <label className="form-label">
              Education Multi-Select
              {selectedEducations.length > 0 && (
                <span style={{ textTransform: "none", fontWeight: 400, marginLeft: "8px", color: "var(--primary)" }}>
                  ({selectedEducations.length} selected)
                </span>
              )}
            </label>
            <div className="pills-container">
              {COMMON_EDUCATIONS.map((edu) => {
                const isActive = selectedEducations.includes(edu);
                return (
                  <button
                    key={edu}
                    type="button"
                    className={`pill-item ${isActive ? "active" : ""}`}
                    onClick={() => onEducationToggle(edu)}
                    id={`edu-pill-${edu}`}
                    aria-pressed={isActive}
                  >
                    {isActive ? "✓ " : "+ "}
                    {edu}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="filter-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onReset}
            disabled={loading}
            id="reset-filters-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            Reset Filters
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="search-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Searching...
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search Candidates
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
