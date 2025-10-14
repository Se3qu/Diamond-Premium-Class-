// -------------------------------------------------------
// ⚙️ App.jsx — Rota Yönetimi + Mevcut Sidebar Entegrasyonu
// -------------------------------------------------------

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "./context/ProjectContext";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";

import DashboardHome from "./pages/DashboardHome";
import BlockDashboard from "./components/BlockDashboard";
import MaterialReport from "./pages/MaterialReport";
import LaborReport from "./pages/LaborReport";
import WorkItems from "./pages/WorkItems"; // ✅ Yeni sayfa eklendi

function App() {
  const [activePage, setActivePage] = useState("projects"); // Varsayılan sayfa

  return (
    <ProjectProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          {/* Sol Menü */}
          <Sidebar activePage={activePage} setActivePage={setActivePage} />

          {/* Ana İçerik Alanı */}
          <main className="flex-1 overflow-auto">
            <Routes>
              {/* Eski sistem (Sidebar içi varsayılan sayfa) */}
              <Route
                path="/"
                element={
                  activePage === "projects" ? <DashboardView /> : <BlockDashboard />
                }
              />

              {/* Ana Dashboard */}
              <Route path="/dashboard" element={<DashboardHome />} />

              {/* Alt rapor sayfaları */}
              <Route path="/blocks" element={<BlockDashboard />} />
              <Route path="/materials" element={<MaterialReport />} />
              <Route path="/labor" element={<LaborReport />} />

              {/* ✅ Yeni Work Items sayfası */}
              <Route path="/work-items" element={<WorkItems />} />

              {/* Varsayılan yönlendirme */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ProjectProvider>
  );
}

export default App;
