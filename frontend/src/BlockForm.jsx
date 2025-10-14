import { useState } from "react";

function BlockForm({ projectId, onBlockAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    floor_count: "",
    status: "planning",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/blocks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        project_id: projectId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("🧱 Yeni blok başarıyla eklendi!");
        setFormData({ name: "", floor_count: "", status: "planning" });
        onBlockAdded(); // Listeyi yenile
      })
      .catch(() => alert("❌ Blok eklenemedi, bağlantıyı kontrol et."));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <h4>➕ Blok Ekle</h4>
      <input
        type="text"
        name="name"
        placeholder="Blok adı"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ marginRight: "10px" }}
      />
      <input
        type="number"
        name="floor_count"
        placeholder="Kat sayısı"
        value={formData.floor_count}
        onChange={handleChange}
        required
        style={{ marginRight: "10px" }}
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        style={{ marginRight: "10px" }}
      >
        <option value="planning">planning</option>
        <option value="in_progress">in_progress</option>
        <option value="completed">completed</option>
      </select>
      <button
        type="submit"
        style={{
          background: "#007bff",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "5px",
        }}
      >
        Kaydet
      </button>
    </form>
  );
}

export default BlockForm;
