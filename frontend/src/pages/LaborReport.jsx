// -------------------------------------------------------
// 👷‍♂️ LaborReport.jsx
// İş Gücü (Personel) ilerleme raporu — ReportLayout ile entegre
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

function LaborReport() {
  // -------------------------------
  // 🧠 State & Ref
  // -------------------------------
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  // -------------------------------
  // 📡 Veri Çekme (Backend)
  // -------------------------------
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/labor/progress")
      .then((res) => setData(res.data))
      .catch((err) => console.error("İş gücü verileri alınamadı:", err));
  }, []);

  // -------------------------------
  // 📊 Genel Durum Özeti
  // -------------------------------
  const totalWorkers = data.reduce((s, t) => s + (t.total_workers || 0), 0);
  const activeWorkers = data.reduce((s, t) => s + (t.active_workers || 0), 0);
  const absent = data.reduce((s, t) => s + (t.absent || 0), 0);
  const subcontractors = data.length;
  const performance =
    totalWorkers > 0 ? ((activeWorkers / totalWorkers) * 100).toFixed(1) : 0;

  // -------------------------------
  // 📋 Özet Metin
  // -------------------------------
  const summaryText = `Toplam İşçi: ${totalWorkers}   Aktif: ${activeWorkers}   Devamsız: ${absent}   Alt Yüklenici: ${subcontractors}   Performans: ${performance}%`;

  // -------------------------------
  // 📈 Grafik Verileri
  // -------------------------------
  const chartData = {
    labels: data.map((t) => t.subcontractor_name || "Taşeron"),
    datasets: [
      {
        label: "Performans (%)",
        data: data.map((t) =>
          t.total_workers
            ? ((t.active_workers / t.total_workers) * 100).toFixed(1)
            : 0
        ),
        backgroundColor: "rgba(231, 76, 60, 0.8)",
        borderColor: "rgba(192, 57, 43, 1)",
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
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } },
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
        title="👷‍♂️ İş Gücü İlerleme Raporu"
        subtitle="Diamond Premium Life – Kusto Smart Dashboard"
        summaryText={summaryText}
        chartRef={chartRef}
        tableHead={[
          "Alt Yüklenici",
          "Toplam İşçi",
          "Aktif",
          "Devamsız",
          "Performans %",
        ]}
        tableBody={data.map((t) => [
          t.subcontractor_name,
          t.total_workers,
          t.active_workers,
          t.absent,
          `${t.total_workers
            ? ((t.active_workers / t.total_workers) * 100).toFixed(1)
            : 0}%`,
        ])}
        fileName="Kusto_Isgucu_Raporu"
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
            <thead className="bg-red-100 text-gray-800 text-sm">
              <tr>
                <th className="border p-3">Alt Yüklenici</th>
                <th className="border p-3">Toplam İşçi</th>
                <th className="border p-3">Aktif</th>
                <th className="border p-3">Devamsız</th>
                <th className="border p-3">Performans (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t, i) => (
                <tr
                  key={i}
                  className="hover:bg-red-50 text-center text-sm transition-colors"
                >
                  <td className="border p-3 font-medium text-gray-800">
                    {t.subcontractor_name}
                  </td>
                  <td className="border p-3">{t.total_workers}</td>
                  <td className="border p-3">{t.active_workers}</td>
                  <td className="border p-3">{t.absent}</td>
                  <td className="border p-3 font-semibold text-red-700">
                    {t.total_workers
                      ? ((t.active_workers / t.total_workers) * 100).toFixed(1)
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
          <span className="font-mono">/labor/progress</span> · Sistem:{" "}
          <span className="font-semibold">
            Kusto Smart Construction Dashboard
          </span>
        </div>
      )}
    </div>
  );
}

export default LaborReport;
