import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import Register from "./pages/Register";
import TaskHistory from "./components/TaskHistory";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman tanpa Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Halaman dengan Navbar */}
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/add-task"
          element={
            <>
              <Navbar />
              <AddTask />
            </>
          }
        />
        <Route
          path="/edit-task/:id"
          element={
            <>
              <Navbar />
              <EditTask />
            </>
          }
        />
        <Route
          path="/history"
          element={
            <>
              <Navbar />
              <TaskHistory />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;