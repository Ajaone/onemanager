// src/components/CardItem.jsx
export default function CardItem({ title, count }) {
    return (
      <div className="bg-white shadow rounded p-5 w-full">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    );
  }
  