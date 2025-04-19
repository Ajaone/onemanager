import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/Statcard";
import axios from "axios";

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [forumCount, setForumCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCounts = async () => {
      try {
        const userRes = await axios.get("https://localhost:7142/api/user/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const forumRes = await axios.get("https://localhost:7142/api/forum/count", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserCount(userRes.data.count);
        setForumCount(forumRes.data.count);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="ml-16"> {    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total Users" value={userCount} />
            <StatCard title="Forum Posts" value={forumCount} />
            <StatCard title="Active Sessions" value={"-"} />
          </div>
        </div>
      </div>
    </div>}
    </div>
  );
}
