import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    location: "",
    description: "",
  });

  // FastAPI'den projeleri al
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Proje listesi alınamadı:", error);
    }
  };

  // Yeni proje ekle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/projects/", newProject);
      setNewProject({ name: "", location: "", description: "" });
      fetchProjects();
    } catch (error) {
      console.error("Proje eklenemedi:", error);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🏗️ Proje Yönetim Sistemi</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Proje Adı"
          value={newProject.name}
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Konum"
          value={newProject.location}
          onChange={(e) =>
            setNewProject({ ...newProject, location: e.target.value })
          }
        />
        <textarea
          placeholder="Açıklama"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
        />
        <button type="submit">Ekle</button>
      </form>

      <h2>📋 Proje Listesi</h2>
      {projects.length === 0 ? (
        <p>Henüz proje bulunamadı.</p>
      ) : (
        <ul>
          {projects.map((proj) => (
            <li key={proj.id}>
              <strong>{proj.name}</strong> — {proj.location}
              <p>{proj.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
