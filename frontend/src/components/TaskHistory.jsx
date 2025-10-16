import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.warn("Token tidak ditemukan di localStorage.");
          return;
        }

        const url =
          taskId && !isNaN(taskId)
            ? `http://localhost:8000/tasks/${taskId}/history`
            : `http://localhost:8000/tasks/all/logs?skip=0&limit=50`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });

        setLogs(res.data);
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [taskId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Memuat riwayat...</span>
        </div>
      </div>
    );

  const renderFields = (data) => {
    if (!data) return <p className="text-muted fst-italic">Tidak ada data</p>;
    return (
      <ul className="list-unstyled ms-3 mb-0">
        <li><strong>Judul:</strong> {data.title || "-"}</li>
        <li><strong>Deskripsi:</strong> {data.description || "-"}</li>
        <li><strong>Penanggung jawab:</strong> {data.assignee || "-"}</li>
        <li><strong>Status:</strong> {data.status || "-"}</li>
        <li><strong>Tanggal mulai:</strong> {data.start_date || "-"}</li>
        <li><strong>Tanggal selesai:</strong> {data.end_date || "-"}</li>
      </ul>
    );
  };

  return (
    <div className="container-fluid py-4 min-vh-100 bg-light">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-clock-history me-2"></i> Riwayat Aktivitas
          </h4>
        </div>

        <div className="card-body">
          {logs.length === 0 ? (
            <div className="text-center text-muted py-5">
              <p className="fs-5">Tidak ada riwayat ditemukan.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Waktu</th>
                    <th scope="col">Aksi</th>
                    <th scope="col">Task ID</th>
                    <th scope="col" style={{ width: "50%" }}>Perubahan</th>
                    <th scope="col">User</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="text-center">
                        {log.action === "update" ? (
                          <span className="badge bg-info text-dark">Update</span>
                        ) : log.action === "create" ? (
                          <span className="badge bg-success">Create</span>
                        ) : (
                          <span className="badge bg-danger">Delete</span>
                        )}
                      </td>
                      <td className="text-center">{log.task_id}</td>
                      <td>
                        {log.action === "update" ? (
                          <div className="d-flex flex-column gap-2">
                            <div className="border rounded p-2 bg-light-subtle">
                              <strong className="text-info">Sebelum:</strong>
                              {renderFields(log.old_value)}
                            </div>
                            <div className="border rounded p-2 bg-light">
                              <strong className="text-success">Sesudah:</strong>
                              {renderFields(log.new_value)}
                            </div>
                          </div>
                        ) : log.action === "create" ? (
                          <div className="border rounded p-2 bg-light">
                            <strong className="text-success">Data baru:</strong>
                            {renderFields(log.new_value)}
                          </div>
                        ) : (
                          <div className="border rounded p-2 bg-light-subtle">
                            <strong className="text-danger">Dihapus:</strong>
                            {renderFields(log.old_value)}
                          </div>
                        )}
                      </td>
                      <td className="text-center">{log.performed_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
