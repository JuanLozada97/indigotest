import { useAuth } from "../auth/AuthContext";

export function ProductsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
        <h1 className="text-xl font-semibold text-indigo-400">Productos</h1>
        <div className="flex items-center gap-3 text-sm">
          {user && (
            <span className="text-gray-300">
              Sesión: <span className="font-semibold">{user.username}</span>{" "}
              ({user.role ?? "User"})
            </span>
          )}
          <button
            onClick={logout}
            className="rounded-md border border-slate-600 px-3 py-1 hover:bg-slate-800 text-xs"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <p className="text-gray-400">
          Aquí irá el listado y CRUD de productos conectado a{" "}
          <code className="bg-slate-800 px-1 rounded">/api/products</code>.
        </p>
      </main>
    </div>
  );
}
