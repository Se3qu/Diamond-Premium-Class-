// -------------------------------------------------------
// 📦 BlockDashboard.jsx
// Tam entegre (ReportLayout + Chart + PDF + QR + Table)
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

// Chart.js modül kayıtları
ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

// -------------------------------------------------------
// 🔹 Ana Fonksiyon Bileşeni
// -------------------------------------------------------
function BlockDashboard() {
  // -------------------------------
  // 🧠 State ve referanslar
  // -------------------------------
  const [data, setData] = useState([]); // API'den gelen blok verileri
  const chartRef = useRef(null); // Chart referansı (PDF için kullanılacak)

  // -------------------------------
  // 📡 Veri Çekme (Backend)
  // -------------------------------
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/blocks/progress")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Veri alınamadı:", err));
  }, []);

  // -------------------------------
  // 📊 Genel Durum Özeti Hesaplama
  // -------------------------------
  const totalFlats = data.reduce((s, b) => s + (b.total || 0), 0);
  const totalBos = data.reduce((s, b) => s + (b["boş"] || 0), 0);
  const totalRezerve = data.reduce((s, b) => s + (b["rezerve"] || 0), 0);
  const totalSatildi = data.reduce((s, b) => s + (b["satıldı"] || 0), 0);
  const genelDoluluk = totalFlats
    ? (((totalRezerve + totalSatildi) / totalFlats) * 100).toFixed(1)
    : 0;

  // -------------------------------
  // 🧾 Ekran + PDF’de birebir aynı görünümde özet metin
  // -------------------------------
  const summaryText = `Toplam: ${totalFlats}   Boş: ${totalBos}   Rezerve: ${totalRezerve}   Satıldı: ${totalSatildi}   Doluluk: ${genelDoluluk}%`;

  // -------------------------------
  // 📈 Grafik Verileri
  // -------------------------------
  const chartData = {
    labels: data.map((b) => `Blok ${b.block_name}`),
    datasets: [
      {
        label: "Doluluk (%)",
        data: data.map((b) => b.doluluk_yüzdesi),
        backgroundColor: "rgba(41, 128, 185, 0.8)",
        borderColor: "rgba(41, 128, 185, 1)",
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
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
        title: { display: true, text: "Doluluk (%)" },
      },
    },
  };

  // -------------------------------------------------------
  // 🧩 Return — Sayfa Arayüzü
  // -------------------------------------------------------
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* -----------------------------------------------------
         🧱 1. Ortak Rapor Şablonu (Üst Başlık, Özet, PDF Butonu)
         ----------------------------------------------------- */}
      <ReportLayout
        title="📊 Blok Doluluk Raporu"
        subtitle="Diamond Premium Life – Kusto Smart Dashboard"
        summaryText={summaryText}
        chartRef={chartRef}
        tableHead={["Blok", "Toplam", "Boş", "Rezerve", "Satıldı", "Doluluk %"]}
        tableBody={data.map((b) => [
          b.block_name,
          b.total,
          b["boş"],
          b["rezerve"],
          b["satıldı"],
          `${b.doluluk_yüzdesi}%`,
        ])}
        fileName="Kusto_Blok_Doluluk_Raporu"
      />

      {/* -----------------------------------------------------
         📊 2. Grafik Alanı
         ----------------------------------------------------- */}
      {data.length > 0 ? (
        <div className="bg-white p-4 rounded-xl shadow mt-6 flex justify-center">
          <div className="relative" style={{ width: "70%", height: "280px" }}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">Yükleniyor...</p>
      )}

      {/* -----------------------------------------------------
         📋 3. Tablo Alanı
         ----------------------------------------------------- */}
      {data.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden mt-6">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100 text-gray-800 text-sm">
              <tr>
                <th className="border p-3">Blok</th>
                <th className="border p-3">Toplam</th>
                <th className="border p-3">Boş</th>
                <th className="border p-3">Rezerve</th>
                <th className="border p-3">Satıldı</th>
                <th className="border p-3">Doluluk (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr
                  key={b.block_id}
                  className="hover:bg-blue-50 text-center text-sm transition-colors"
                >
                  <td className="border p-3 font-medium text-gray-800">
                    {b.block_name}
                  </td>
                  <td className="border p-3">{b.total}</td>
                  <td className="border p-3">{b["boş"]}</td>
                  <td className="border p-3">{b["rezerve"]}</td>
                  <td className="border p-3">{b["satıldı"]}</td>
                  <td className="border p-3 font-semibold text-blue-700">
                    {b.doluluk_yüzdesi}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* -----------------------------------------------------
         🧾 4. Alt Bilgi Alanı (Kaynak vs.)
         ----------------------------------------------------- */}
      {data.length > 0 && (
        <div className="text-center text-xs text-gray-500 mt-6">
          Veri Kaynağı: Backend API{" "}
          <span className="font-mono">/blocks/progress</span> · Sistem:{" "}
          <span className="font-semibold">
            Kusto Smart Construction Dashboard
          </span>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------
// ✅ Dışa Aktarım
// -------------------------------------------------------
export default BlockDashboard;
