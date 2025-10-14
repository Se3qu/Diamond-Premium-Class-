// -------------------------------------------------------
// 🧱 MaterialReport.jsx
// Rapor Şablonu (ReportLayout) ile entegre malzeme ilerleme raporu
// -------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import ReportLayout from "../components/ReportLayout";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

function MaterialReport() {
  // -------------------------------
  // 🧠 State & Ref
  // -------------------------------
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  // -------------------------------
  // 📡 Veri Çekme (Backend)
  // Örnek endpoint: /materials/progress
  // -------------------------------
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/materials/progress")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Malzeme verileri alınamadı:", err));
  }, []);

  // -------------------------------
  // 📊 Genel Durum Özeti
  // -------------------------------
  const totalItems = data.reduce((s, m) => s + (m.total || 0), 0);
  const delivered = data.reduce((s, m) => s + (m.delivered || 0), 0);
  const pending = data.reduce((s, m) => s + (m.pending || 0), 0);
  const used = data.reduce((s, m) => s + (m.used || 0), 0);
  const completion =
    totalItems > 0 ? ((delivered / totalItems) * 100).toFixed(1) : 0;

  // -------------------------------
  // 📋 Özet Metin (UI + PDF aynı)
  // -------------------------------
  const summaryText = `Toplam: ${totalItems}   Teslim Edilen: ${delivered}   Bekleyen: ${pending}   Kullanılan: ${used}   Tamamlanma: ${completion}%`;

  // -------------------------------
  // 📈 Grafik Verileri
  // -------------------------------
  const chartData = {
    labels: data.map((m) => m.material_name || "Malzeme"),
    datasets: [
      {
        label: "Teslimat (%)",
        data: data.map((m) =>
          m.total ? ((m.delivered / m.total) * 100).toFixed(1) : 0
        ),
        backgroundColor: "rgba(39, 174, 96, 0.8)",
        borderColor: "rgba(39, 174, 96, 1)",
        borderWidth: 1.2,
        borderRadius: 4,
      },
    ],
  };

  // -------------------------------
  // ⚙️ Grafik Seçenekleri
  // -------------------------------
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } },
    },
  };

  // -------------------------------
  // 🧩 UI Render
  // -------------------------------
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* -----------------------------------------------------
         📋 ReportLayout — Ortak Rapor Şablonu
         ----------------------------------------------------- */}
      <ReportLayout
        title="📦 Malzeme İlerleme Raporu"
        subtitle="Diamond Premium Life – Kusto Smart Dashboard"
        summaryText={summaryText}
        chartRef={chartRef}
        tableHead={[
          "Malzeme Adı",
          "Toplam",
          "Teslim Edilen",
          "Bekleyen",
          "Kullanılan",
          "Tamamlanma %",
        ]}
        tableBody={data.map((m) => [
          m.material_name,
          m.total,
          m.delivered,
          m.pending,
          m.used,
          `${m.total ? ((m.delivered / m.total) * 100).toFixed(1) : 0}%`,
        ])}
        fileName="Kusto_Malzeme_Raporu"
      />

      {/* -----------------------------------------------------
         📊 Grafik Alanı
         ----------------------------------------------------- */}
      {data.length > 0 ? (
        <div className="bg-white p-4 rounded-xl shadow mt-6 flex justify-center">
          <div className="relative" style={{ width: "70%", height: "280px" }}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">Veri yükleniyor...</p>
      )}

      {/* -----------------------------------------------------
         📋 Tablo Alanı
         ----------------------------------------------------- */}
      {data.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden mt-6">
          <table className="w-full border-collapse">
            <thead className="bg-green-100 text-gray-800 text-sm">
              <tr>
                <th className="border p-3">Malzeme Adı</th>
                <th className="border p-3">Toplam</th>
                <th className="border p-3">Teslim Edilen</th>
                <th className="border p-3">Bekleyen</th>
                <th className="border p-3">Kullanılan</th>
                <th className="border p-3">Tamamlanma (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((m, i) => (
                <tr
                  key={i}
                  className="hover:bg-green-50 text-center text-sm transition-colors"
                >
                  <td className="border p-3 font-medium text-gray-800">
                    {m.material_name}
                  </td>
                  <td className="border p-3">{m.total}</td>
                  <td className="border p-3">{m.delivered}</td>
                  <td className="border p-3">{m.pending}</td>
                  <td className="border p-3">{m.used}</td>
                  <td className="border p-3 font-semibold text-green-700">
                    {m.total
                      ? ((m.delivered / m.total) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* -----------------------------------------------------
         🧾 Alt Bilgi
         ----------------------------------------------------- */}
      {data.length > 0 && (
        <div className="text-center text-xs text-gray-500 mt-6">
          Veri Kaynağı: Backend API{" "}
          <span className="font-mono">/materials/progress</span> · Sistem:{" "}
          <span className="font-semibold">
            Kusto Smart Construction Dashboard
          </span>
        </div>
      )}
    </div>
  );
}

export default MaterialReport;
