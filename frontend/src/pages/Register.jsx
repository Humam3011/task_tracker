import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "Karyawan",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length > 72) {
      setMessage("❌ Password maksimal 72 karakter");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registrasi gagal");
      setMessage("✅ Registrasi berhasil. Silakan login.");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="col-md-6 col-lg-4 bg-white p-4 shadow rounded">
        <h2 className="text-center mb-4 text-primary fw-bold">
          📝 Daftar Akun Baru
        </h2>

        <form onSubmit={handleSubmit}>
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

          {/* Role */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Pilih Role</label>
            <select
              className="form-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="PM">Project Manager</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold py-2"
          >
            Daftar
          </button>
        </form>

        {/* Pesan sukses / error */}
        {message && (
          <div
            className={`alert mt-3 text-center ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* Link ke Login */}
        <p className="mt-4 text-center">
          Sudah punya akun?{" "}
          <Link
            to="/"
            className="text-decoration-none text-primary fw-semibold"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
