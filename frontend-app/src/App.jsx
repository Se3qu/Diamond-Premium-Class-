import { useEffect, useState } from "react";

function App() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("Bağlantı kuruluyor...");

  useEffect(() => {
    // Backend bağlantı testi
    fetch("http://127.0.0.1:8000/api/test")
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus("❌ Bağlantı hatası"));

    // Projeleri çek
    fetch("http://127.0.0.1:8000/projects/")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Backend'den gelen veriler:", data);
        setProjects(data);
      })
      .catch((err) => console.error("⚠️ Fetch hatası:", err));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🚧 Construction Dashboard</h1>
      <h3>{status}</h3>
      <hr />
      <h2>📋 Proje Listesi</h2>

      {projects.length === 0 ? (
        <p>Henüz proje bulunamadı.</p>
      ) : (
        projects.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#f3f3f3",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{p.name}</h3>
            <p>📍 {p.location}</p>
            <p>
              🗓️ {p.start_date} → {p.end_date}
            </p>
            <p>{p.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
