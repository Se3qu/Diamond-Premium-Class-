import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import logo from "../assets/logo.jpg";

export default function ReportLayout({
  title = "📊 Rapor Başlığı",
  subtitle = "Kusto Smart Construction System",
  summaryText = "",
  chartRef = null,
  tableHead = [],
  tableBody = [],
  fileName = "Kusto_Rapor",
}) {
  const today = new Date().toLocaleDateString("tr-TR");
  const reportId = `KUSTO-${Date.now().toString(36).toUpperCase()}`;

  // ✅ PDF Export — tüm rapor türleri için ortak yapı
  const handleExportPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const verifyUrl = `https://kusto-verify.app/verify?id=${reportId}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    // 🔹 Logo
    try {
      doc.addImage(logo, "JPG", 165, 10, 30, 10);
    } catch {}

    // 🔹 Başlık
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("KUSTO HOME", 14, 18);
    doc.setFontSize(12);
    doc.text(title, 14, 26);
    doc.setFontSize(9);
    doc.text(`Rapor No: ${reportId}`, 14, 33);
    doc.text(`Tarih: ${today}`, 60, 33);

    // 🔹 Özet
    if (summaryText) {
      doc.setFontSize(11);
      doc.text("📋 Genel Durum Özeti", 14, 45);
      doc.setFontSize(9);
      doc.text(summaryText, 14, 52);
    }

    // 🔹 Grafik
    const chartCanvas =
      chartRef?.current?.canvas || chartRef?.current?.container?.firstChild;
    if (chartCanvas) {
      const chartImage = chartCanvas.toDataURL("image/png", 1.0);
      doc.addImage(chartImage, "PNG", 25, 60, 160, 55);
    }

    // 🔹 Tablo
    if (tableHead.length && tableBody.length) {
      autoTable(doc, {
        startY: 125,
        head: [tableHead],
        body: tableBody,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { font: "helvetica", fontSize: 10 },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          const pageHeight = doc.internal.pageSize.height;
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(`Sayfa ${data.pageNumber}/${pageCount}`, 180, pageHeight - 10);
          doc.setFontSize(9);
          doc.text(subtitle, 14, pageHeight - 10);
        },
      });
    }

    // 🔹 QR + İmza
    const finalY = doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 20
      : 200;
    doc.setFontSize(10);
    doc.text("Hazırlayan:", 14, finalY);
    doc.line(40, finalY, 100, finalY);
    doc.text("Onaylayan:", 14, finalY + 10);
    doc.line(40, finalY + 10, 100, finalY + 10);
    doc.text("Tarih:", 14, finalY + 20);
    doc.text(today, 40, finalY + 20);

    doc.addImage(qrDataUrl, "PNG", 160, finalY - 5, 30, 30);
    doc.setFontSize(8);
    doc.textWithLink("🔗 Doğrulama Linki", 160, finalY + 32, { url: verifyUrl });

    doc.save(`${fileName}_${today}.pdf`);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      {/* Üst başlık */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          📄 PDF’ye Aktar
        </button>
      </div>

      {/* Özet kutusu */}
      {summaryText && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4 text-center">
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            📋 Genel Durum Özeti
          </h2>
          <p className="text-gray-800 text-base font-medium">{summaryText}</p>
        </div>
      )}
    </div>
  );
}
