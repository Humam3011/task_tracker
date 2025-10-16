import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

const AddTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
    start_date: "",
    end_date: "",
    status: "Belum Dimulai",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await API.post("/tasks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Tugas berhasil ditambahkan");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast.error("❌ Gagal menambahkan tugas");
      console.error(err);
    }
  };

  return (
    <div className="container py-5 min-vh-100 bg-light">
      <Toaster position="top-right" />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-header bg-success text-white text-center py-3">
              <h4 className="mb-0">
                <i className="bi bi-journal-plus me-2"></i>Tambah Tugas
              </h4>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                {/* Judul */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Judul Tugas</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Masukkan judul tugas"
                    required
                  />
                </div>

                {/* Deskripsi */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Deskripsi</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Masukkan deskripsi tugas (opsional)"
                  ></textarea>
                </div>

                {/* Penanggung Jawab */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Penanggung Jawab</label>
                  <input
                    type="text"
                    name="assignee"
                    value={form.assignee}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Nama karyawan"
                  />
                </div>

                {/* Tanggal Mulai & Selesai */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tanggal Mulai</label>
                    <input
                      type="date"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tanggal Selesai</label>
                    <input
                      type="date"
                      name="end_date"
                      value={form.end_date}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Belum Dimulai">Belum Dimulai</option>
                    <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                {/* Tombol */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg fw-semibold shadow-sm"
                  >
                    <i className="bi bi-save me-2"></i> Simpan Tugas
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
