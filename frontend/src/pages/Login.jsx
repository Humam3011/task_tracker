import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login gagal");

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_role", data.role);
      navigate("/dashboard");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="col-md-6 col-lg-4 bg-white p-4 shadow rounded">
        <h2 className="text-center mb-4 text-primary fw-bold">
          🔐 Task Tracker Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold py-2"
          >
            Login
          </button>
        </form>

        {/* Pesan Error */}
        {error && (
          <div className="alert alert-danger mt-3 text-center" role="alert">
            {error}
          </div>
        )}

        {/* Link ke Register */}
        <p className="mt-4 text-center">
          Belum punya akun?{" "}
          <Link to="/register" className="text-decoration-none text-primary fw-semibold">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
