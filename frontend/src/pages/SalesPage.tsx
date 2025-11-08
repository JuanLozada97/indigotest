import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.js";
import {
  getSales,
  createSale,
  deleteSale,
  getSalesReport,
  type Sale,
  type CreateSaleItem,
} from "../api/sales.js";
import { getProducts, type Product } from "../api/products.js";

export function SalesPage() {
  const { user, logout } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [saleItems, setSaleItems] = useState<CreateSaleItem[]>([]);
  const [reportStartDate, setReportStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [reportEndDate, setReportEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  async function loadSales() {
    try {
      setLoading(true);
      setError(null);
      const data = await getSales();
      setSales(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Error loading products:", err);
    }
  }

  useEffect(() => {
    void loadSales();
    void loadProducts();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (saleItems.length === 0) {
      setError("Debes agregar al menos un producto a la venta");
      return;
    }

    // Validar que todos los productos estén seleccionados
    const invalidItems = saleItems.filter(item => item.productId === 0);
    if (invalidItems.length > 0) {
      setError("Todos los productos deben estar seleccionados antes de crear la venta");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await createSale({
        saleDate: new Date(saleDate).toISOString(),
        saleItems,
      });
      setSaleItems([]);
      setSaleDate(new Date().toISOString().split("T")[0]);
      await loadSales();
    } catch (err: any) {
      setError(err.message || "Error al crear la venta");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta venta? Se restaurará el stock de los productos.")) {
      return;
    }

    try {
      await deleteSale(id);
      await loadSales();
    } catch (err: any) {
      setError(err.message || "Error al eliminar la venta");
    }
  }

  function addSaleItem() {
    setSaleItems([...saleItems, { productId: 0, quantity: 1 }]);
  }

  function updateSaleItem(index: number, field: keyof CreateSaleItem, value: any) {
    const updated = [...saleItems];
    updated[index] = { ...updated[index], [field]: value };
    setSaleItems(updated);
  }

  function removeSaleItem(index: number) {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  }

  async function handleGenerateReport() {
    try {
      setReportLoading(true);
      setError(null);
      const data = await getSalesReport(reportStartDate, reportEndDate);
      setReport(data);
      setShowReport(true);
    } catch (err: any) {
      setError(err.message || "Error al generar el reporte");
    } finally {
      setReportLoading(false);
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-indigo-400">Ventas</h1>
          <nav className="flex gap-2">
            <Link
              to="/products"
              className="px-3 py-1 rounded text-sm hover:bg-slate-800 text-gray-300 border border-slate-600"
            >
              Productos
            </Link>
            <Link
              to="/sales"
              className="px-3 py-1 rounded text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            >
              Ventas
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user && (
            <span className="text-gray-300">
              Sesión: <span className="font-semibold">{user.username}</span> (
              {user.role ?? "User"})
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

      <main className="flex-1 p-6 space-y-6">
        {error && (
          <div className="text-sm text-red-300 bg-red-900/30 border border-red-500/50 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Formulario de nueva venta */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-400">
            Nueva Venta
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">
                Fecha de Venta
              </label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium">Productos</label>
                <button
                  type="button"
                  onClick={addSaleItem}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  + Agregar Producto
                </button>
              </div>
              {saleItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 mb-2 p-3 bg-slate-900 rounded border border-slate-700"
                >
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      updateSaleItem(index, "productId", Number(e.target.value))
                    }
                    className="flex-1 rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value={0}>Seleccionar producto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock: {p.stock}) - {formatCurrency(p.price)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateSaleItem(index, "quantity", Number(e.target.value))
                    }
                    placeholder="Cantidad"
                    className="w-24 rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeSaleItem(index)}
                    className="px-3 py-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving || saleItems.length === 0}
              className="w-full inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 px-4 py-2 text-sm font-semibold transition"
            >
              {saving ? "Guardando..." : "Crear Venta"}
            </button>
          </form>
        </div>

        {/* Reporte por rango de fechas */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-400">
            Reporte de Ventas
          </h2>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={reportStartDate}
                onChange={(e) => setReportStartDate(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={reportEndDate}
                onChange={(e) => setReportEndDate(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 rounded-md text-sm font-semibold transition"
              >
                {reportLoading ? "Generando..." : "Generar Reporte"}
              </button>
            </div>
          </div>

          {showReport && report && (
            <div className="mt-4 p-4 bg-slate-900 rounded border border-slate-700">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-400">Total Ventas</div>
                  <div className="text-lg font-semibold">{report.totalSales}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Ingresos Totales</div>
                  <div className="text-lg font-semibold text-green-400">
                    {formatCurrency(report.totalRevenue)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Período</div>
                  <div className="text-sm">
                    {formatDate(report.startDate)} - {formatDate(report.endDate)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de ventas */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-400">
            Historial de Ventas
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando...</div>
          ) : sales.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No hay ventas registradas
            </div>
          ) : (
            <div className="space-y-4">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold">
                        Venta #{sale.id} - {formatDate(sale.saleDate)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {sale.saleItems.length} producto(s)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-400">
                        {formatCurrency(sale.total)}
                      </div>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="mt-2 text-xs text-red-400 hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {sale.saleItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm bg-slate-800 px-3 py-2 rounded"
                      >
                        <span>
                          {item.productName} x{item.quantity} @{" "}
                          {formatCurrency(item.unitPrice)}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

