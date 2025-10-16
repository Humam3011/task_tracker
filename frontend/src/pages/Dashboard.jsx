import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("user_role");
  const token = localStorage.getItem("access_token");

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState("Semua");

  const API_URL = "http://127.0.0.1:8000/tasks";

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL + "/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setFilteredTasks(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === "Semua") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((t) => t.status === status));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  const countByStatus = (status) =>
    tasks.filter((t) => t.status === status).length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold fs-2">
          📋 Task Dashboard
        </h1>
      </div>

      {/* Statistik Ringkas */}
      <div className="row mb-4 text-center">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="text-secondary">Belum Dimulai</h5>
              <h2 className="text-primary fw-bold">{countByStatus("Belum Dimulai")}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="text-secondary">Sedang Dikerjakan</h5>
              <h2 className="text-warning fw-bold">{countByStatus("Sedang Dikerjakan")}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="text-secondary">Selesai</h5>
              <h2 className="text-success fw-bold">{countByStatus("Selesai")}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Tambah */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <label className="me-2 fw-semibold">Filter:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="Semua">Semua</option>
            <option value="Belum Dimulai">Belum Dimulai</option>
            <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        {role === "PM" && (
          <Link to="/add-task" className="btn btn-primary">
            ➕ Tambah Tugas
          </Link>
        )}
      </div>

      {/* Daftar Tugas */}
      {filteredTasks.length === 0 ? (
        <p className="fst-italic text-muted">Tidak ada tugas untuk filter ini.</p>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Penanggung Jawab</th>
                <th>Status</th>
                <th>Mulai</th>
                <th>Selesai</th>
                {role === "PM" && <th className="text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="fw-semibold">{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.assignee}</td>
                  <td>{task.status}</td>
                  <td>{task.start_date ? new Date(task.start_date).toLocaleDateString() : "-"}</td>
                  <td>{task.end_date ? new Date(task.end_date).toLocaleDateString() : "-"}</td>
                  {role === "PM" && (
                    <td className="text-center">
                      <Link to={`/edit-task/${task.id}`} className="btn btn-sm btn-warning me-2">
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(task.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
