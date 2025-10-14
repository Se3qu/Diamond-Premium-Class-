import { useState, useEffect } from "react";

function BlockForm({ projects, onBlockAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    floor_count: "",
    status: "planning",
    project_id: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/blocks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        onBlockAdded();
        setFormData({
          name: "",
          floor_count: "",
          status: "planning",
          project_id: "",
        });
      })
      .catch((err) => console.error("Blok eklenemedi:", err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff3e6",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h3>🏗️ Yeni Blok Ekle</h3>
      <input
        name="name"
        placeholder="Blok adı (örn: Block A)"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="floor_count"
        placeholder="Kat sayısı"
        value={formData.floor_count}
        onChange={handleChange}
        required
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="planning">planning</option>
        <option value="in_progress">in_progress</option>
        <option value="completed">completed</option>
      </select>

      <select
        name="project_id"
        value={formData.project_id}
        onChange={handleChange}
        required
      >
        <option value="">-- Proje seçin --</option>
        {projects.map((proj) => (
          <option key={proj.id} value={proj.id}>
            {proj.name}
          </option>
        ))}
      </select>

      <br />
      <button type="submit" style={{ marginTop: "10px" }}>
        Kaydet
      </button>
    </form>
  );
}

export default BlockForm;
