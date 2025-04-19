import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AddUserModal from "../components/AddUserModal";
import EditUserRoleModal from "../components/EditUserModal";
import ResetPasswordModal from "../components/ResetPasswordModal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [resetUserId, setResetUserId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://localhost:7142/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data); // role harus ada di dalam data
    } catch (err) {
      console.error("Gagal ambil data user", err);
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) return;
  
    const headers = ["Username", "Full Name", "Role"];
    const rows = users.map((user) => [
      user.userName,
      user.fullName,
      user.role
    ]);
  
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-16">{
        }</div>
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">User Management</h2>
            <td>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Tambah User
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded ml-2"
            >
              Export CSV
            </button>
            </td>
          </div>
          <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Full Name</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.userName}</td>
                  <td className="p-2">{u.fullName}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2 space-x-2 text-center">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={() => setEditingUser({ id: u.id, role: u.role })}
                    >
                      Role
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => setResetUserId(u.id)}
                    >Reset</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchUsers}
          />
        )}

        {editingUser && (
          <EditUserRoleModal
            userId={editingUser.id}
            currentRole={editingUser.role}
            onClose={() => setEditingUser(null)}
            onSuccess={fetchUsers}
          />
        )}

        {resetUserId && (
          <ResetPasswordModal
            userId={resetUserId}
            onClose={() => setResetUserId(null)}
            onSuccess={fetchUsers}
          />
        )}
      </div>
    </div>
  );
}
