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
        blocks: [], // yeni proje eklerken boş başlıyor
      }),
    })
      .then((res) => res.json())
      .then(() => {
        onProjectAdded(); // Proje listesini yeniler
        setFormData({
          name: "",
          location: "",
          start_date: "",
          end_date: "",
          description: "",
        });
      })
      .catch((err) => console.error("Proje eklenemedi:", err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#eaf4ff",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h3>➕ Yeni Proje Ekle</h3>
      <input
        name="name"
        placeholder="Proje adı"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        placeholder="Lokasyon"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Proje açıklaması"
        value={formData.description}
        onChange={handleChange}
        rows="2"
        required
      />
      <br />
      <button type="submit" style={{ marginTop: "10px" }}>
        Kaydet
      </button>
    </form>
  );
}

export default ProjectForm;
