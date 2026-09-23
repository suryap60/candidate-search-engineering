import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { searchCandidates } from "../api/candidateApi";
import CandidateTable from "../components/CandidateTable";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import SearchFilters from "../components/SearchFilters";
import type { Candidate, CandidateSearchParams } from "../types/candidate";

const DEFAULT_PAGE_SIZE = 20;

export default function Candidates() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL search parameters
  const initialFiltersFromUrl = useMemo<CandidateSearchParams>(() => {
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : DEFAULT_PAGE_SIZE;
    const minAge = searchParams.get("minAge") ? Number(searchParams.get("minAge")) : undefined;
    const maxAge = searchParams.get("maxAge") ? Number(searchParams.get("maxAge")) : undefined;
    const gender = searchParams.get("gender") || undefined;
    const location = searchParams.get("location") || undefined;
    const education = searchParams.get("education") || undefined;
    const createdFrom = searchParams.get("createdFrom") || undefined;
    const createdTo = searchParams.get("createdTo") || undefined;
    const lastLoginFrom = searchParams.get("lastLoginFrom") || undefined;
    const lastLoginTo = searchParams.get("lastLoginTo") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    return {
      page,
      pageSize,
      minAge,
      maxAge,
      gender,
      location,
      education,
      createdFrom,
      createdTo,
      lastLoginFrom,
      lastLoginTo,
      sortBy,
      sortOrder,
    };
  }, [searchParams]);

  // Local filter inputs state for active form editing
  const [filters, setFilters] = useState<CandidateSearchParams>(initialFiltersFromUrl);

  // Candidate data & UI states
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(initialFiltersFromUrl.page || 1);
  const [pageSize, setPageSize] = useState<number>(initialFiltersFromUrl.pageSize || DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Detect whether custom filters are applied
  const hasActiveFilters = Boolean(
    initialFiltersFromUrl.minAge !== undefined ||
    initialFiltersFromUrl.maxAge !== undefined ||
    (initialFiltersFromUrl.gender && initialFiltersFromUrl.gender !== "All") ||
    initialFiltersFromUrl.location ||
    initialFiltersFromUrl.education ||
    initialFiltersFromUrl.createdFrom ||
    initialFiltersFromUrl.createdTo ||
    initialFiltersFromUrl.lastLoginFrom ||
    initialFiltersFromUrl.lastLoginTo
  );

  // Apply search params to URL
  const pushParamsToUrl = useCallback((params: CandidateSearchParams) => {
    const nextParams = new URLSearchParams();

    if (params.page && params.page > 1) {
      nextParams.set("page", String(params.page));
    }
    if (params.pageSize && params.pageSize !== DEFAULT_PAGE_SIZE) {
      nextParams.set("pageSize", String(params.pageSize));
    }
    if (params.minAge !== undefined && params.minAge !== null && params.minAge !== "") {
      nextParams.set("minAge", String(params.minAge));
    }
    if (params.maxAge !== undefined && params.maxAge !== null && params.maxAge !== "") {
      nextParams.set("maxAge", String(params.maxAge));
    }
    if (params.gender && params.gender !== "All") {
      nextParams.set("gender", params.gender);
    }
    if (params.location?.trim()) {
      nextParams.set("location", params.location.trim());
    }
    if (params.education?.trim()) {
      nextParams.set("education", params.education.trim());
    }
    if (params.createdFrom) {
      nextParams.set("createdFrom", params.createdFrom);
    }
    if (params.createdTo) {
      nextParams.set("createdTo", params.createdTo);
    }
    if (params.lastLoginFrom) {
      nextParams.set("lastLoginFrom", params.lastLoginFrom);
    }
    if (params.lastLoginTo) {
      nextParams.set("lastLoginTo", params.lastLoginTo);
    }
    if (params.sortBy && params.sortBy !== "createdAt") {
      nextParams.set("sortBy", params.sortBy);
    }
    if (params.sortOrder && params.sortOrder !== "desc") {
      nextParams.set("sortOrder", params.sortOrder);
    }

    setSearchParams(nextParams);
  }, [setSearchParams]);

  // Fetch candidates from backend API
  const performFetch = useCallback(async (paramsToSearch: CandidateSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchCandidates(paramsToSearch);
      if (response.success && response.data) {
        setCandidates(response.data.items || []);
        setTotalCount(response.data.totalCount || 0);
        setPage(response.data.page || 1);
        setPageSize(response.data.pageSize || DEFAULT_PAGE_SIZE);
      } else {
        setError(response.message || "Failed to retrieve candidates.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          return;
        }
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (!err.response) {
          setError("Unable to connect to the backend. Please check your network or server status.");
        } else {
          setError("Unable to load candidates. Please try again.");
        }
      } else {
        setError("An unexpected error occurred while loading candidates.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch whenever the URL parameters change
  useEffect(() => {
    let active = true;

    // Asynchronous trigger to prevent synchronous state mutation inside effect
    const timeoutId = setTimeout(() => {
      if (!active) return;
      performFetch(initialFiltersFromUrl);
      setFilters(initialFiltersFromUrl);
    }, 0);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [initialFiltersFromUrl, performFetch]);

  // Handle single filter change in form
  const handleFilterChange = (key: keyof CandidateSearchParams, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle education pill toggle
  const handleEducationToggle = (edu: string) => {
    setFilters((prev) => {
      const currentList = prev.education
        ? prev.education.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      let updatedList: string[];
      if (currentList.includes(edu)) {
        updatedList = currentList.filter((item) => item !== edu);
      } else {
        updatedList = [...currentList, edu];
      }

      return {
        ...prev,
        education: updatedList.length > 0 ? updatedList.join(",") : undefined,
      };
    });
  };

  // Submit search (resets to page 1)
  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const updated = {
      ...filters,
      page: 1,
      pageSize,
    };
    pushParamsToUrl(updated);
  };

  // Reset filters (clears all filters and reloads page 1)
  const handleReset = () => {
    const cleanDefaults: CandidateSearchParams = {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      minAge: undefined,
      maxAge: undefined,
      gender: undefined,
      location: undefined,
      education: undefined,
      createdFrom: undefined,
      createdTo: undefined,
      lastLoginFrom: undefined,
      lastLoginTo: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(cleanDefaults);
    pushParamsToUrl(cleanDefaults);
  };

  // Pagination navigation
  const handlePageChange = (newPage: number) => {
    const updated = {
      ...initialFiltersFromUrl,
      page: newPage,
      pageSize,
    };
    pushParamsToUrl(updated);
  };

  // Page size change
  const handlePageSizeChange = (newSize: number) => {
    const updated = {
      ...initialFiltersFromUrl,
      page: 1,
      pageSize: newSize,
    };
    pushParamsToUrl(updated);
  };

  // Header sorting toggle
  const handleSortChange = (column: string) => {
    let newOrder = "asc";
    if (initialFiltersFromUrl.sortBy === column) {
      newOrder = initialFiltersFromUrl.sortOrder === "asc" ? "desc" : "asc";
    }
    const updated = {
      ...initialFiltersFromUrl,
      page: 1,
      sortBy: column,
      sortOrder: newOrder,
    };
    pushParamsToUrl(updated);
  };

  return (
    <>
      <Navbar />

      <main className="app-container">
        {/* Error notification */}
        {error && (
          <div className="alert alert-error" role="alert" style={{ marginTop: "24px" }} id="candidates-error-alert">
            <span className="alert-icon">⚠️</span>
            <div style={{ flex: 1 }}>{error}</div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => performFetch(initialFiltersFromUrl)}
              style={{ padding: "4px 10px", fontSize: "12px" }}
              id="retry-fetch-btn"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Filter panel */}
        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onEducationToggle={handleEducationToggle}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {/* Results summary bar */}
        <div className="results-bar">
          <div className="results-count">
            <span>Search Results</span>
            <span className="results-count-badge" id="results-count-badge">
              {totalCount} {totalCount === 1 ? "candidate" : "candidates"} found
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleReset}
              style={{ fontSize: "12.5px", padding: "6px 12px" }}
              id="quick-clear-filters-btn"
            >
              ✕ Clear active filters
            </button>
          )}
        </div>

        {/* Candidate table */}
        <CandidateTable
          candidates={candidates}
          loading={loading}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleReset}
          sortBy={initialFiltersFromUrl.sortBy}
          sortOrder={initialFiltersFromUrl.sortOrder}
          onSortChange={handleSortChange}
        />

        {/* Pagination toolbar */}
        {totalCount > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
          />
        )}
      </main>
    </>
  );
}