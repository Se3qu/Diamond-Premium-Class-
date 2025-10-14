import { useEffect, useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/work_items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Work Items Dashboard</h1>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Name (EN)</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Category</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.code}>
              <td className="border p-2">{item.code}</td>
              <td className="border p-2">{item.name_en}</td>
              <td className="border p-2">{item.unit}</td>
              <td className="border p-2">{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
