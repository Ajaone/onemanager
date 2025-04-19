// src/components/StatCard.jsx
export default function StatCard({ title, value }) {
    return (
      <div className="bg-white shadow p-6 rounded text-center">
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    );
  }
  