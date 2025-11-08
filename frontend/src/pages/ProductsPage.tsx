import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products.js";
import type { Product } from "../api/products.js";
import { uploadProductImage } from "../api/blobStorage.js";

type FormMode = "create" | "edit";

const emptyForm: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrl: "",
};

export function ProductsPage() {
  const { user, logout } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  }

  function startCreate() {
    setFormMode("create");
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(p: Product) {
    setFormMode("edit");
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl ?? "",
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }
      if (formMode === "create") {
        const created = await createProduct({
          name: form.name,
          description: form.description,
          price: form.price,
          stock: form.stock,
          imageUrl: imageUrl || null,
        });
        setProducts((prev) => [...prev, created]);
        setForm(emptyForm);
        setImageFile(null);
      } else if (formMode === "edit" && editingId != null) {
        await updateProduct(editingId, {
          name: form.name,
          description: form.description,
          price: form.price,
          stock: form.stock,
          imageUrl: imageUrl || null,
        });

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  name: form.name,
                  description: form.description,
                  price: form.price,
                  stock: form.stock,
                  imageUrl: imageUrl || null,
                }
              : p
          )
        );

        setFormMode("create");
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (err: any) {
      setError(err.message || "Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar el producto");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-indigo-400">
            Productos
          </h1>
          <nav className="flex gap-2">
            <Link
              to="/products"
              className="px-3 py-1 rounded text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            >
              Productos
            </Link>
            <Link
              to="/sales"
              className="px-3 py-1 rounded text-sm hover:bg-slate-800 text-gray-300 border border-slate-600"
            >
              Ventas
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user && (
            <span className="text-gray-300">
              Sesión:{" "}
              <span className="font-semibold">{user.username}</span>{" "}
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

      <main className="flex-1 p-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* LISTADO */}
        <section className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-indigo-300">
              Lista de productos
            </h2>
            <button
              onClick={startCreate}
              className="text-xs px-3 py-1 rounded-md border border-indigo-500 text-indigo-300 hover:bg-indigo-500/10"
            >
              Nuevo producto
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay productos registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-800/80 text-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-right">Precio</th>
                    <th className="px-3 py-2 text-right">Stock</th>
                    <th className="px-3 py-2 text-left">Imagen</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="px-3 py-2">{p.id}</td>
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2 text-right">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {p.stock}
                      </td>
                      <td className="px-3 py-2">
                        {p.imageUrl ? (
                          <a
                            href={p.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-300 underline"
                          >
                            Ver imagen
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Sin imagen
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex gap-2 justify-end text-xs">
                          <button
                            onClick={() => startEdit(p)}
                            className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-2 py-1 rounded bg-red-600 hover:bg-red-500"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* FORMULARIO */}
        <section className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold text-indigo-300 mb-4">
            {formMode === "create"
              ? "Crear nuevo producto"
              : `Editar producto #${editingId}`}
          </h2>

          {error && (
            <div className="mb-3 text-xs text-red-300 bg-red-900/30 border border-red-500/40 rounded px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium mb-1"
              >
                Nombre
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs font-medium mb-1"
              >
                Descripción
              </label>
            </div>
            <input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="price"
                  className="block text-xs font-medium mb-1"
                >
                  Precio
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-medium mb-1"
                >
                </label>
                <label
                  htmlFor="stock"
                  className="block text-xs font-medium mb-1"
                >
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
            <label
                htmlFor="imageUrl"
                className="block text-xs font-medium mb-1"
            >
                URL de imagen (opcional)
            </label>
            <input
                id="imageUrl"
                name="imageUrl"
                value={form.imageUrl ?? ""}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
            />

            <label className="block text-xs font-medium mb-1">
                O seleccionar archivo (se subirá a Blob Storage)
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
                }}
                className="w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-indigo-600 file:text-xs file:text-white hover:file:bg-indigo-500"
            />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {formMode === "edit" && (
                <button
                  type="button"
                  onClick={startCreate}
                  className="px-3 py-1 rounded-md border border-slate-600 text-xs hover:bg-slate-800"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/60 text-sm font-semibold"
              >
                {saving
                  ? "Guardando..."
                  : formMode === "create"
                  ? "Crear"
                  : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
