import { useState } from "react";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://localhost:7142/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login berhasil!");
      // redirect ke dashboard nanti
    } else {
      alert(data || "Gagal login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label className="text-sm font-medium text-gray-700">Username</label>
        <input type="text" name="username" value={form.username} onChange={handleChange}
          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange}
          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div className="text-right text-sm">
        <a href="#" className="text-blue-600 hover:underline">Forgot your password?</a>
      </div>
      <button type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">
        Sign in
      </button>
    </form>
  );
}
