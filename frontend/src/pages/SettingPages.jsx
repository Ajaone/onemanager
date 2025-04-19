// src/pages/SettingsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import ISO6391 from "iso-639-1";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState("");
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("https://localhost:7142/api/settings/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFullName(res.data.fullName);
      setLanguage(res.data.languagePreference);
    } catch (err) {
      console.error("Gagal ambil data profil:", err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("https://localhost:7142/api/settings/profile", {
        fullName,
        languagePreference: language,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Pengaturan berhasil disimpan.");
    } catch (err) {
      console.error("Gagal simpan data:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16">
        <Topbar />
        <div className="max-w-xl mx-auto p-6">
          <h2 className="text-xl font-bold mb-4">Pengaturan Profil</h2>
          <label className="block mb-2">Full Name</label>
          <input
            className="w-full border p-2 mb-4 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label className="block mb-2">Bahasa</label>
          <select
            className="w-full border p-2 mb-4 rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {ISO6391.getAllCodes().map(code => (
              <option key={code} value={code}>
                {ISO6391.getNativeName(code)} ({code})
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
