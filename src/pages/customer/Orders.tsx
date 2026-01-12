import { useEffect, useState } from "react";
import { orderService } from "../../services/order.service";

interface OrderItem {
  product?: { name: string };
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | string;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderService.getMyOrders();

        /**
         * SOPORTE ROBUSTO BACKEND
         * - array directo
         * - data envuelta
         */
        const list: Order[] =
          Array.isArray(data)
            ? data
            : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];

        setOrders(list);
      } catch {
        setError("No se pudieron cargar las órdenes");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
        Cargando órdenes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-green-500">
            Mis Órdenes
          </h1>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="mb-4">
              Aún no tienes órdenes registradas
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow p-6"
              >
                {/* CABECERA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Orden #{order._id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                      ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        {item.product?.name ?? "Producto eliminado"} ×{" "}
                        {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>Total</span>
                  <span className="text-green-700">
                    ${order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          © {new Date().getFullYear()} RVMIA Store · Historial de Órdenes
        </div>
      </footer>
    </div>
  );
}
