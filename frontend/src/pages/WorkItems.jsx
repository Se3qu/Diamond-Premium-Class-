import { useEffect, useState } from "react";
import { generateKustoPDF } from "../utils/pdfTemplate";

export default function WorkItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("tr");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/work_items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching work items:", err);
        setLoading(false);
      });
  }, []);

  const translations = {
    en: {
      name: "Name",
      unit: "Unit",
      title: "Work Items — Diamond Premium Life",
      source: "Data Source: Supabase · System: Kusto Smart Construction Dashboard",
      exportPdf: "Export to PDF",
      filter: "Filter by Category",
      all: "All",
    },
    tr: {
      name: "İş Kalemi",
      unit: "Birim",
      title: "İş Kalemleri — Diamond Premium Life",
      source: "Veri Kaynağı: Supabase · Sistem: Kusto Akıllı İnşaat Paneli",
      exportPdf: "PDF’ye Aktar",
      filter: "Kategoriye Göre Filtrele",
      all: "Tümü",
    },
    ru: {
      name: "Наименование",
      unit: "Ед.",
      title: "Виды работ — Diamond Premium Life",
      source: "Источник данных: Supabase · Система: Kusto Smart Construction Dashboard",
      exportPdf: "Экспорт в PDF",
      filter: "Фильтр по категории",
      all: "Все",
    },
  };

  const categoryTranslations = {
    en: { Structure: "Structure", Finishes: "Finishes", Facade: "Facade", Masonry: "Masonry", Waterproofing: "Waterproofing", MEP: "MEP", "External Works": "External Works", "External Networks": "External Networks", "Vertical Transport": "Vertical Transport", General: "General", Roof: "Roof", Logistics: "Logistics", Architectural: "Architectural", Landscaping: "Landscaping", Earthworks: "Earthworks" },
    tr: { Structure: "Yapı", Finishes: "Bitişler", Facade: "Cephe", Masonry: "Duvar", Waterproofing: "Su Yalıtımı", MEP: "Mekanik & Elektrik", "External Works": "Dış Alan", "External Networks": "Dış Hatlar", "Vertical Transport": "Asansör / Dikey Taşıma", General: "Genel", Roof: "Çatı", Logistics: "Lojistik", Architectural: "Mimari", Landscaping: "Peyzaj", Earthworks: "Toprak İşleri" },
    ru: { Structure: "Конструкции", Finishes: "Отделочные работы", Facade: "Фасад", Masonry: "Кладка", Waterproofing: "Гидроизоляция", MEP: "Инженерные системы", "External Works": "Наружные работы", "External Networks": "Наружные сети", "Vertical Transport": "Вертикальный транспорт", General: "Общие работы", Roof: "Крыша", Logistics: "Логистика", Architectural: "Архитектурные работы", Landscaping: "Благоустройство", Earthworks: "Земляные работы" },
  };

  const unitTranslations = {
    en: { "м²": "m²", "м³": "m³", "шт": "pcs", "м": "m", "компл": "set" },
    tr: { "м²": "m²", "м³": "m³", "шт": "adet", "м": "m", "компл": "takım" },
    ru: { "м²": "м²", "м³": "м³", "шт": "шт", "м": "м", "компл": "компл." },
  };

  const getNameByLanguage = (item) =>
    language === "en" ? item.name_en : language === "ru" ? item.name_ru : item.name_tr;

  const getCategoryByLanguage = (category) =>
    categoryTranslations[language][category] || category;

  const getUnitByLanguage = (unit) =>
    unitTranslations[language][unit] || unit;

  const t = translations[language];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // 🧾 PDF export (kurumsal tasarımlı)
  const exportToPDF = () => {
    const tableBody = filteredItems.map((item) => [
      getNameByLanguage(item),
      getUnitByLanguage(item.unit),
    ]);

    const doc = generateKustoPDF({
      title: t.title,
      tableHead: [t.name, t.unit],
      tableBody,
      source: t.source,
    });

    const today = new Date().toLocaleDateString();
    doc.save(`Work_Items_Report_${today.replace(/\//g, "-")}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">🌐 Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-black text-sm rounded px-2 py-1 bg-white"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">{t.filter}:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-black text-sm rounded px-2 py-1 bg-white"
            >
              <option value="all">{t.all}</option>
              {Object.keys(categoryTranslations[language]).map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryByLanguage(cat)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded px-3 py-2 transition"
          >
            📄 {t.exportPdf}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading work items...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-black bg-white shadow-lg">
          <table className="min-w-full border-collapse text-sm text-left">
            <thead className="bg-gray-200 text-gray-900 uppercase border-b-2 border-black">
              <tr>
                <th className="border border-black px-4 py-3.5 font-semibold">{t.name}</th>
                <th className="border border-black px-4 py-3.5 text-center font-semibold">{t.unit}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.code}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                  >
                    <td className="border border-black px-4 py-4 text-gray-800">
                      {getNameByLanguage(item)}
                    </td>
                    <td className="border border-black px-4 py-4 text-center text-gray-800">
                      {getUnitByLanguage(item.unit)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="border border-black p-4 text-center text-gray-600">
                    No work items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-gray-700 mt-6">{t.source}</p>
    </div>
  );
}
