import React from "react";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">{children}</div>
    </div>
  );
}
