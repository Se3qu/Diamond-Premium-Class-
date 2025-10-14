// -------------------------------------------------------
// 🧩 DashboardHome.jsx
// Üç ana rapor modülünü sekmeli yapıda birleştirir
// + Üst kontrol menüsü (Yenile, PDF İndir, Ayarlar)
// -------------------------------------------------------

import { useState, useRef } from "react";
import BlockDashboard from "../components/BlockDashboard"; // ✅ doğru yol
import MaterialReport from "./MaterialReport";
import LaborReport from "./LaborReport";
import { jsPDF } from "jspdf";

function DashboardHome() {
  const [activeTab, setActiveTab] = useState("block");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const blockRef = useRef(null);
  const materialRef = useRef(null);
  const laborRef = useRef(null);

  const tabs = [
    { id: "block", name: "🏢 Blok Doluluk", ref: blockRef, component: <BlockDashboard ref={blockRef} /> },
    { id: "material", name: "🧱 Malzeme Raporu", ref: materialRef, component: <MaterialReport ref={materialRef} /> },
    { id: "labor", name: "👷‍♂️ İş Gücü Raporu", ref: laborRef, component: <LaborReport ref={laborRef} /> },
  ];

  // 🔄 Sayfa Yenileme
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
    window.location.reload();
  };

  // 📄 Toplu PDF İndirme (her raporun PDF versiyonu)
  const handleDownloadAllPDFs = async () => {
    alert("📄 Her raporun PDF çıktısı hazırlanıyor...");

    const reports = [
      { name: "Kusto_Blok_Doluluk_Raporu.pdf" },
      { name: "Kusto_Malzeme_Raporu.pdf" },
      { name: "Kusto_Isgucu_Raporu.pdf" },
    ];

    for (const report of reports) {
      const doc = new jsPDF();
      doc.text(report.name.replace(".pdf", ""), 20, 20);
      doc.text("Bu PDF, toplu indirme özelliği örneğidir.", 20, 30);
      doc.save(report.name);
      await new Promise((r) => setTimeout(r, 500)); // küçük gecikme
    }

    alert("✅ 3 PDF çıktısı indirildi!");
  };

  // ⚙️ Ayarlar Butonu
  const handleSettings = () => {
    alert("⚙️ Ayarlar paneli henüz aktif değil. İlerde sistem yapılandırması buradan yapılacak.");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Üst Başlık */}
      <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🧠 KUSTO SMART CONSTRUCTION DASHBOARD
          </h1>
          <p className="text-sm text-gray-500">
            Diamond Premium Life – Yönetim Paneli
          </p>
        </div>

        {/* Sağ Üst Kontrol Menüsü */}
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isRefreshing
                ? "bg-gray-400 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            🔄 Yenile
          </button>

          <button
            onClick={handleDownloadAllPDFs}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-all"
          >
            📄 PDF Toplu İndir
          </button>

          <button
            onClick={handleSettings}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all"
          >
            ⚙️ Ayarlar
          </button>
        </div>
      </header>

      {/* Sekmeler */}
      <div className="px-8 mt-6">
        <div className="flex space-x-4 border-b border-gray-300 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-t-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-700 border border-b-0 border-gray-300 shadow-sm"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Aktif Sekme İçeriği */}
        <div className="mt-6 bg-white rounded-xl shadow p-4">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>

      {/* Alt bilgi */}
      <footer className="text-center text-xs text-gray-500 py-4 mt-8">
        © {new Date().getFullYear()} Kusto Smart Construction System · Tüm hakları saklıdır
      </footer>
    </div>
  );
}

export default DashboardHome;
