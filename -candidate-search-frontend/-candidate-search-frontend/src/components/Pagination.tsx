interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading: boolean;
}

export default function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  loading,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(totalCount, page * pageSize);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pagination-container" id="pagination-bar">
      <div className="pagination-info">
        Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of{" "}
        <strong>{totalCount}</strong> candidates
      </div>

      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          id="pagination-prev-btn"
          aria-label="Previous Page"
          style={{ padding: "6px 12px" }}
        >
          &larr; Prev
        </button>

        {/* Page Number Buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${idx}`} style={{ padding: "0 6px", color: "var(--text-dim)" }}>
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === page;

          return (
            <button
              key={pageNum}
              type="button"
              className={`page-num-btn ${isActive ? "active" : ""}`}
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
              id={`page-btn-${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          id="pagination-next-btn"
          aria-label="Next Page"
          style={{ padding: "6px 12px" }}
        >
          Next &rarr;
        </button>
      </div>

      {/* Page Size Selector */}
      <div className="page-size-selector">
        <label htmlFor="page-size-select">Per page:</label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={loading}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
