import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const role = localStorage.getItem("user_role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white" to="/dashboard">
          TaskTracker
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard">
                Dashboard
              </Link>
            </li>

            {role === "PM" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/add-task">
                    Tambah Tugas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/history">
                    Riwayat
                  </Link>
                </li>
              </>
            )}
          </ul>

          <button
            className="btn btn-outline-light btn-sm px-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
