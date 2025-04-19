// src/pages/ForumPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import NewPostForm from "../components/NewPostForum";
import EditPostModal from "../components/EditPostModal"; // ⬅️ tambahkan import ini

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://localhost:7142/api/forum", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Gagal ambil data forum:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus postingan ini?")) return;

    try {
      await axios.delete(`https://localhost:7142/api/forum/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error("Gagal hapus post:", err);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="max-w-2xl mx-auto p-6">
          <NewPostForm onSuccess={fetchPosts} />

          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded shadow p-4 mb-4 border">
              <p className="font-semibold mb-1">{post.user?.fullName}</p>
              <p className="mb-2 whitespace-pre-wrap">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full max-h-[400px] object-cover rounded"
                />
              )}
              <p className="text-sm text-gray-400 mt-2">
                {new Date(post.createdAt).toLocaleString()}
              </p>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={fetchPosts}
        />
      )}
    </div>
  );
}
