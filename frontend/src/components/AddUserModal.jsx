// src/components/AddUserModal.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    languagePreference: "",
    password: "",
    role: "Member",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://localhost:7142/api/User/add", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Sukses!", "User berhasil ditambahkan.", "success");
      onSuccess();
      onClose();
    } catch (err) {
      Swal.fire("Gagal", "Gagal menambahkan user.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Tambah User Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="username" placeholder="Username" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="fullName" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="languagePreference" placeholder="Language Preference" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" />
          <select name="role" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-1 rounded">Batal</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  );
}
