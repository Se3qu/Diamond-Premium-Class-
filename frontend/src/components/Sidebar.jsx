// -------------------------------------------------------
// 🧭 Sidebar.jsx — Daraltılabilir Navigasyon Menüsü
// -------------------------------------------------------

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  // -------------------------------------------------------
  // 📋 Menü Öğeleri
  // -------------------------------------------------------
  const menuItems = [
    { name: "📁 Projeler", path: "/dashboard" },
    { name: "🏢 Blok Doluluk", path: "/blocks" },
    { name: "🧱 Malzeme Raporu", path: "/materials" },
    { name: "👷‍♂️ İş Gücü Raporu", path: "/labor" },
    { name: "📋 İş Kalemleri", path: "/work-items" }, // ✅ Yeni entegre edildi
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white shadow-md border-r border-gray-200 flex flex-col transition-all duration-300`}
    >
      {/* Üst Logo ve Daralt Butonu */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="text-center">
            <h1 className="text-xl font-bold text-blue-700 tracking-tight">
              🧠 KUSTO
            </h1>
            <p className="text-xs text-gray-500">Smart System</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Menü Alanı */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activePath === item.path
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
            } ${collapsed ? "justify-center" : "justify-start"}`}
          >
            <span className="whitespace-nowrap">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Alt Bilgi */}
      <div
        className={`p-3 border-t text-xs text-gray-400 text-center ${
          collapsed ? "hidden" : "block"
        }`}
      >
        © {new Date().getFullYear()} Kusto System
      </div>
    </aside>
  );
}

export default Sidebar;
