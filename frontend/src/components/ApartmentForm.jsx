import { useState } from "react";

function ApartmentForm({ onApartmentAdded }) {
  const [blockId, setBlockId] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [formData, setFormData] = useState({
    number: "",
    floor: "",
    area_m2: "",
    status: "available",
  });

  // Blok listesini yükle
  const fetchBlocks = () => {
    fetch("http://127.0.0.1:8000/blocks/")
      .then((res) => res.json())
      .then((data) => setBlocks(data))
      .catch(() => setBlocks([]));
  };

  // İlk açılışta blokları yükle
  if (blocks.length === 0) fetchBlocks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!blockId) return alert("Lütfen bir blok seçin.");

    fetch("http://127.0.0.1:8000/apartments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, block_id: parseInt(blockId) }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("🏠 Daire başarıyla eklendi!");
        setFormData({ number: "", floor: "", area_m2: "", status: "available" });
        setBlockId("");
        onApartmentAdded();
      })
      .catch(() => alert("❌ Hata: Daire eklenemedi."));
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>🏠 Yeni Daire Ekle</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "10px",
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <select
          value={blockId}
          onChange={(e) => setBlockId(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">-- Blok Seçin --</option>
          {blocks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.status})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Daire No (örn: A101)"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Kat"
          value={formData.floor}
          onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Alan (m²)"
          value={formData.area_m2}
          onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
          required
        />

        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="available">available</option>
          <option value="reserved">reserved</option>
          <option value="sold">sold</option>
        </select>

        <button
          type="submit"
          style={{
            background: "#007BFF",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}

export default ApartmentForm;
