import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
    start_date: "",
    end_date: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await API.post("/tasks", form); // ✅ gunakan 'API' (huruf besar)
        toast.success("Tugas berhasil ditambahkan");
        setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
        toast.error("Gagal menambahkan tugas");
    }
    };


  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-semibold mb-4">📝 Tambah Tugas</h1>
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
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi"
          className="border p-2 w-full rounded"
        />
        <input
          name="assignee"
          value={form.assignee}
          onChange={handleChange}
          placeholder="Penanggung Jawab"
          className="border p-2 w-full rounded"
        />
        <div className="flex space-x-4">
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default AddTask;
