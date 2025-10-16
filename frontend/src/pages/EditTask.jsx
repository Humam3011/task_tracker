import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
    is_completed: false,
    start_date: "",
    end_date: "",
    status: "Belum Dimulai",
  });

  // Ambil data task berdasarkan ID
  const fetchTask = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await API.get(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data tugas");
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setForm({ ...form, is_completed: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await API.put(`/tasks/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tugas berhasil diperbarui");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui tugas");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Toaster position="top-right" />
      <div className="col-md-8 col-lg-6 bg-white shadow p-4 rounded">
        <h3 className="fw-bold mb-4 text-center text-primary">
          ✏️ Edit Tugas
        </h3>

        <form onSubmit={handleSubmit}>
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
              value={form.description || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Tuliskan deskripsi tugas"
              rows="3"
            ></textarea>
          </div>

          {/* Penanggung Jawab */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Penanggung Jawab</label>
            <input
              type="text"
              name="assignee"
              value={form.assignee || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Nama penanggung jawab"
            />
          </div>

          {/* Status */}
          <div className="mb-3">
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

          {/* Tanggal Mulai & Selesai */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Tanggal Mulai</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Tanggal Selesai</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              ← Kembali
            </button>
            <button type="submit" className="btn btn-warning text-white">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
