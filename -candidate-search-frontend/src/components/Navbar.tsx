import { useNavigate } from "react-router-dom";
import { clearTokens } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1 className="brand-title" style={{ margin: 0, fontSize: "19px" }}>Candidate Search</h1>
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-danger-outline"
          id="logout-btn"
          aria-label="Logout"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
