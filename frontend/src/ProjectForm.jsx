import { useState } from "react";

function ProjectForm({ onProjectAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/projects/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        blocks: [], // Şimdilik boş
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("✅ Yeni proje başarıyla eklendi!");
        onProjectAdded(); // Listeyi yenile
      })
      .catch(() => alert("❌ Proje eklenemedi, sunucuya ulaşılamıyor."));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "30px",
      }}
    >
      <h2>➕ Yeni Proje Ekle</h2>
      <input
        type="text"
        name="name"
        placeholder="Proje adı"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        name="location"
        placeholder="Lokasyon"
        value={formData.location}
        onChange={handleChange}
        required
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        required
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
        required
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <textarea
        name="description"
        placeholder="Proje açıklaması"
        value={formData.description}
        onChange={handleChange}
        rows="3"
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      ></textarea>

      <button
        type="submit"
        style={{
          background: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Kaydet
      </button>
    </form>
  );
}

export default ProjectForm;
