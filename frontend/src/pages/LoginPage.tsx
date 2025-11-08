import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import { useAuth } from "../auth/AuthContext.js";

type LoginResponse = {
  token: string | null;
  username: string;
  role: string | null;
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        // no requiresAuth: login es público
      });

      if (!result.token) {
        setError("Usuario o contraseña inválidos.");
        setLoading(false);
        return;
      }

      login(result.token, { username: result.username, role: result.role });
      navigate("/products", { replace: true });
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-100">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-indigo-400">
          IndigoTest – Login
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Ingresa con tu usuario para acceder al panel.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-900/30 border border-red-500/50 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 px-4 py-2 text-sm font-semibold transition"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
