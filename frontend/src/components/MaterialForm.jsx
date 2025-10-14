import { useState } from "react";

function MaterialForm({ onMaterialAdded }) {
  const [blockId, setBlockId] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit_price: "",
    record_type: "teslimat",
    date: "",
  });

  const fetchBlocks = () => {
    fetch("http://127.0.0.1:8000/blocks/")
      .then((res) => res.json())
      .then((data) => setBlocks(data))
      .catch(() => setBlocks([]));
  };

  if (blocks.length === 0) fetchBlocks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!blockId) return alert("Lütfen bir blok seçin.");

    const total_cost =
      parseFloat(formData.quantity || 0) * parseFloat(formData.unit_price || 0);

    fetch("http://127.0.0.1:8000/materials/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        total_cost,
        block_id: parseInt(blockId),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("🧾 Malzeme başarıyla eklendi!");
        setFormData({
          name: "",
          quantity: "",
          unit_price: "",
          record_type: "teslimat",
          date: "",
        });
        setBlockId("");
        onMaterialAdded();
      })
      .catch(() => alert("❌ Hata: Malzeme eklenemedi."));
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>🧾 Yeni Malzeme Kaydı</h3>
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
          placeholder="Malzeme Adı"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Miktar"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Birim Fiyat"
          value={formData.unit_price}
          onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
          required
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <select
          value={formData.record_type}
          onChange={(e) =>
            setFormData({ ...formData, record_type: e.target.value })
          }
        >
          <option value="teslimat">teslimat</option>
          <option value="kullanım">kullanım</option>
          <option value="iade">iade</option>
        </select>

        <button
          type="submit"
          style={{
            background: "#28A745",
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

export default MaterialForm;
