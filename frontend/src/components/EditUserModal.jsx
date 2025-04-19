// src/components/EditUserRoleModal.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function EditUserRoleModal({ userId, currentRole, onClose, onSuccess }) {
  const [role, setRole] = useState(currentRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://localhost:7142/api/User/role/${userId}`, JSON.stringify(role), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire("Berhasil!", "Role berhasil diperbarui.", "success");
      onSuccess();
      onClose();
    } catch (err) {
      Swal.fire("Gagal", "Gagal mengubah role.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit Role User</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-1 rounded">Batal</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
