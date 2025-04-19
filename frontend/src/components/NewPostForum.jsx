// src/components/NewPostForm.jsx
import { useState } from "react";
import axios from "axios";

export default function NewPostForm({ onSuccess }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await axios.post("https://localhost:7142/api/forum", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setContent("");
      setImage(null);
      onSuccess();
    } catch (err) {
      console.error("Gagal kirim postingan:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-2 border rounded mb-2 resize-none"
        rows="3"
        required
      />
      <div className="flex items-center justify-between">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </form>
  );
}
