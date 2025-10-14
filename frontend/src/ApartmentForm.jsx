import { useState } from "react";

function ApartmentForm({ blockId, onApartmentAdded }) {
  const [form, setForm] = useState({
    number: "",
    floor: "",
    area_m2: "",
    status: "available",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/apartments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, block_id: blockId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kayıt hatası");
        return res.json();
      })
      .then(() => {
        onApartmentAdded();
        setForm({ number: "", floor: "", area_m2: "", status: "available" });
      })
      .catch((err) => console.error("❌ Daire ekleme hatası:", err));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <input
        name="number"
        placeholder="Daire No"
        value={form.number}
        onChange={handleChange}
        required
      />
      <input
        name="floor"
        placeholder="Kat"
        type="number"
        value={form.floor}
        onChange={handleChange}
        required
      />
      <input
        name="area_m2"
        placeholder="Alan (m²)"
        type="number"
        value={form.area_m2}
        onChange={handleChange}
        required
      />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="available">available</option>
        <option value="reserved">reserved</option>
        <option value="sold">sold</option>
      </select>
      <button type="submit">➕ Daire Ekle</button>
    </form>
  );
}

export default ApartmentForm;
