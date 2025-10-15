import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    is_completed: false,
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/tasks";

  // Ambil semua task
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL + "/");
      setTasks(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // Tambah atau update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, newTask);
        setEditingId(null);
      } else {
        await axios.post(API_URL + "/", newTask);
      }
      setNewTask({ title: "", description: "", is_completed: false });
      fetchTasks();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    }
  };

  // Hapus task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setEditingId(task.id);
    setNewTask(task);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📋 Task Dashboard</h1>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Judul Task"
          className="border p-2 w-full"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Deskripsi"
          className="border p-2 w-full"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        ></textarea>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newTask.is_completed}
            onChange={(e) =>
              setNewTask({ ...newTask, is_completed: e.target.checked })
            }
          />
          Selesai
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Task" : "Tambah Task"}
        </button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.is_completed ? "✅ Selesai" : "⏳ Belum"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
