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
    is_completed: false, // ✅ gunakan field backend
    start_date: "",
    end_date: "",
  });

  // Ambil data task saat halaman dibuka
  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data tugas");
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  // Perubahan input text
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Perubahan checkbox status
  const handleStatusChange = (e) => {
    setForm({ ...form, is_completed: e.target.checked });
  };

  // Simpan perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Data dikirim ke backend:", form);
      await API.put(`/tasks/${id}`, form);
      toast.success("Tugas berhasil diperbarui");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui tugas");
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-semibold mb-4">✏️ Edit Tugas</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Judul Tugas"
          className="border p-2 w-full rounded"
          required
        />

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Deskripsi"
          className="border p-2 w-full rounded"
        />

        <input
          name="assignee"
          value={form.assignee || ""}
          onChange={handleChange}
          placeholder="Penanggung Jawab"
          className="border p-2 w-full rounded"
        />

        {/* ✅ Checkbox status */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_completed}
            onChange={handleStatusChange}
          />
          {form.is_completed ? "✅ Selesai" : "⏳ Belum Selesai"}
        </label>

        <div className="flex space-x-4">
          <input
            type="date"
            name="start_date"
            value={form.start_date || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="end_date"
            value={form.end_date || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default EditTask;
