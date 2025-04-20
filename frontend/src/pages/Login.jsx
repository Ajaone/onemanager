import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';

export default function LoginPage() {
  const [alert, setAlert] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setAlert("Username dan password tidak boleh kosong.");
      return;
    }

    setAlert("");
    setLoading(true);

    try {
      const response = await axios.post("https://localhost:7142/api/Auth/login", {
        username,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const token = response.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setAlert("Token tidak diterima. Coba lagi.");
      }
    } catch (err) {
      setAlert("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign in to OneManager</h2>

        {alert && <AlertMessage message={alert} onClose={() => setAlert("")} />}

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-600"
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded transition ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}