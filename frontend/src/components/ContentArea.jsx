import { useState } from "react";
import axios from "axios";
import { useProjects } from "../context/ProjectContext";
import logo from "../assets/logo.jpg"; // 🔹 Logo dosyan burada olmalı

export default function ContentArea() {
  const { selectedProject, blocks, blocksLoading, blocksError } = useProjects();
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [loadingApts, setLoadingApts] = useState(false);
  const [filter, setFilter] = useState("Tümü");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    floor: "",
    number: "",
    area_m2: "",
    status: "Boş",
  });
  const [editId, setEditId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        ← Soldan bir proje seçiniz
      </div>
    );
  }

  // 🔹 BLOK - DAİRELERİ GETİR
  const handleViewFloors = async (blockId) => {
    try {
      setSelectedBlock(blockId);
      setLoadingApts(true);
      const res = await axios.get(`${API_BASE}/blocks/${blockId}/apartments`);
      setApartments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Daireler alınamadı:", e);
      setApartments([]);
    } finally {
      setLoadingApts(false);
    }
  };

  // 🔹 DURUM GÜNCELLEME
  const handleStatusClick = async (apartmentId) => {
    try {
      const res = await axios.patch(`${API_BASE}/apartments/${apartmentId}/status`);
      const updated = res.data;
      setApartments((prev) =>
        prev.map((item) => (item.id === apartmentId ? updated : item))
      );
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  const filteredApts =
    filter === "Tümü" ? apartments : apartments.filter((a) => a.status === filter);

  // ✅ CSV EXPORT
  const handleExportCSV = () => {
    if (filteredApts.length === 0) {
      alert("Dışa aktarılacak veri bulunamadı!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const blockName = blocks.find((b) => b.id === selectedBlock)?.name || "—";

    const titleRow = [
      `Proje: ${selectedProject.name}`,
      `Blok: ${blockName}`,
      `Tarih: ${today}`,
    ].join(" | ");

    const headers = ["#", "Kat", "Daire No", "Alan (m²)", "Durum"];
    const rows = filteredApts.map((a, i) => [
      i + 1,
      a.floor,
      a.number,
      a.area_m2,
      a.status,
    ]);

    const csvContent = [
      titleRow,
      "",
      headers.join(";"),
      ...rows.map((r) => r.join(";")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${selectedProject.name}_Blok${blockName}_${today}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ PDF EXPORT (Logo + Türkçe karakter + Tam çalışan download)
  const handleExportPDF = async () => {
    if (filteredApts.length === 0) {
      alert("PDF'ye aktarılacak veri bulunamadı!");
      return;
    }

    // jsPDF ve AutoTable modülleri
    import("jspdf").then(async ({ default: jsPDF }) => {
      const { default: autoTable } = await import("jspdf-autotable");
      const doc = new jsPDF();

      const today = new Date().toLocaleDateString("tr-TR");
      const blockName = blocks.find((b) => b.id === selectedBlock)?.name || "—";

      // 🔹 GÜVENLİ FONT — Helvetica (Türkçe karakterleri destekliyor)
      doc.setFont("helvetica", "normal");

      // 🔹 LOGO + ÜST BİLGİ
      try {
        doc.addImage(logo, "JPG", 160, 8, 35, 12);
      } catch (e) {
        console.warn("Logo yüklenemedi:", e);
      }

      doc.setFontSize(16);
      doc.text("KUSTO HOME", 14, 15);
      doc.setFontSize(12);
      doc.text(`${selectedProject.name} – Blok ${blockName}`, 14, 25);
      doc.setFontSize(10);
      doc.text(`Tarih: ${today}`, 14, 32);
      doc.setFontSize(11);
      doc.text("📄 Daire Durum Raporu", 14, 40);

      const tableColumn = ["#", "Kat", "Daire No", "Alan (m²)", "Durum"];
      const tableRows = filteredApts.map((a, i) => [
        i + 1,
        a.floor,
        a.number,
        a.area_m2,
        a.status,
      ]);

      // 🔹 AutoTable ile tablo çizimi
      autoTable(doc, {
        startY: 46,
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185] },
        styles: { font: "helvetica", fontSize: 10 },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          const pageHeight = doc.internal.pageSize.height;
          doc.setFontSize(9);
          doc.text(
            `Hazırlayan: Serik Beibit | ${today} | Sayfa ${data.pageNumber}/${pageCount}`,
            14,
            pageHeight - 10
          );
          doc.text(
            "Kusto Smart Construction System – Diamond Dashboard",
            120,
            pageHeight - 10
          );
        },
      });

      // ✅ Tarayıcıda PDF indirme (Windows, Chrome, Edge uyumlu)
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${selectedProject.name}_Blok${blockName}_${today}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    });
  };

  // 🧱 FORM AÇMA
  const openForm = (apt = null) => {
    if (apt) {
      setEditMode(true);
      setEditId(apt.id);
      setFormData({
        floor: apt.floor,
        number: apt.number,
        area_m2: apt.area_m2,
        status: apt.status,
      });
    } else {
      setEditMode(false);
      setFormData({ floor: "", number: "", area_m2: "", status: "Boş" });
      setEditId(null);
    }
    setShowForm(true);
  };

  // 💾 KAYDETME
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBlock) return alert("Lütfen önce bir blok seçin!");

    try {
      const payload = {
        ...formData,
        floor: parseInt(formData.floor),
        area_m2: parseFloat(formData.area_m2),
        block_id: selectedBlock,
      };

      const res = editMode
        ? await axios.patch(`${API_BASE}/apartments/${editId}`, payload)
        : await axios.post(`${API_BASE}/apartments/`, payload);

      if (editMode) {
        setApartments((prev) =>
          prev.map((a) => (a.id === editId ? res.data : a))
        );
      } else {
        setApartments((prev) => [...prev, res.data]);
      }

      setShowForm(false);
      setEditMode(false);
      setFormData({ floor: "", number: "", area_m2: "", status: "Boş" });
    } catch (err) {
      console.error("Daire kaydedilemedi:", err);
      alert("Bir hata oluştu!");
    }
  };

  // 🔹 HTML
  return (
    <div className="p-4 flex-1 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">
        🏗️ {selectedProject.name} — Blok Listesi
      </h1>

      {blocksLoading && <p className="text-gray-500">Bloklar yükleniyor...</p>}
      {blocksError && <p className="text-red-600">{String(blocksError)}</p>}

      {!blocksLoading && !blocksError && (
        <div className="grid grid-cols-4 gap-4">
          {blocks.map((b) => (
            <div
              key={b.id}
              className={`bg-white shadow rounded-2xl p-4 hover:shadow-lg transition ${
                selectedBlock === b.id ? "border-blue-500 border-2" : ""
              }`}
            >
              <h2 className="text-lg font-semibold">Blok {b.name}</h2>
              <p className="text-gray-600">
                Kat Sayısı: {b.floor_count ?? "—"}
              </p>
              <button
                onClick={() => handleViewFloors(b.id)}
                className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
              >
                Katları Gör
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedBlock && (
        <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-gray-700 flex justify-between items-center">
            <span>🏢 Blok Daire Listesi</span>
            <div className="flex gap-3">
              <button
                onClick={() => openForm()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ➕ Yeni Daire Ekle
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                📤 CSV’ye Aktar
              </button>
              <button
                onClick={handleExportPDF}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                📄 PDF’ye Aktar
              </button>
            </div>
          </h2>

          <div className="flex gap-3 mb-4">
            {["Tümü", "Boş", "Rezerve", "Satıldı"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1 rounded-lg font-semibold border transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loadingApts ? (
            <p className="text-gray-500">Yükleniyor...</p>
          ) : filteredApts.length === 0 ? (
            <p className="text-gray-500">
              Seçilen duruma ait daire kaydı bulunmuyor.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Kat</th>
                  <th className="p-2 border">Daire No</th>
                  <th className="p-2 border">Alan (m²)</th>
                  <th className="p-2 border">Durum</th>
                  <th className="p-2 border">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredApts.map((a, index) => (
                  <tr key={a.id} className="hover:bg-blue-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{a.floor}</td>
                    <td className="p-2 border">{a.number}</td>
                    <td className="p-2 border">{a.area_m2}</td>
                    <td
                      className={`p-2 border cursor-pointer text-center font-semibold ${
                        a.status === "Boş"
                          ? "bg-green-300 text-green-900"
                          : a.status === "Rezerve"
                          ? "bg-orange-300 text-orange-900"
                          : "bg-red-300 text-red-900"
                      }`}
                      onClick={() => handleStatusClick(a.id)}
                      title="Durumu değiştirmek için tıklayın"
                    >
                      {a.status}
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => openForm(a)}
                        className="text-blue-600 hover:underline"
                      >
                        ✏️ Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 📋 FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-center">
              {editMode ? "Daire Düzenle" : "Yeni Daire Ekle"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="number"
                placeholder="Kat"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Daire No"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="number"
                placeholder="Alan (m²)"
                value={formData.area_m2}
                onChange={(e) =>
                  setFormData({ ...formData, area_m2: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                <option>Boş</option>
                <option>Rezerve</option>
                <option>Satıldı</option>
              </select>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
