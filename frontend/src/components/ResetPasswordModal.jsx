import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ResetPasswordModal({ userId, onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7142/api/user/reset-password/${userId}`,
        `"${newPassword}"`, // karena backend pakai string langsung
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire("Sukses!", "Password berhasil direset.", "success");
      onClose();
      onSuccess();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat reset password.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-600"
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
