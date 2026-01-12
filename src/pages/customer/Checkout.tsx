import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";
import { orderService } from "../../services/order.service";
import { useState } from "react";

export default function Checkout() {
  const { items, clear, total } = useCartStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const payload = items.map(item => ({
        productId: item._id,     // MongoDB _id
        quantity: item.quantity
      }));

      await orderService.createOrder(payload);

      clear();
      navigate("/");
    } catch {
      setError("No se pudo completar la compra. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="mb-4 text-gray-600">
            No hay productos en el carrito
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-green-500">
            Checkout
          </h1>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LISTA */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-green-700">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* RESUMEN */}
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h3 className="font-semibold text-lg mb-4">
              Resumen de compra
            </h3>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>${total().toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>Impuestos</span>
              <span>Calculado en backend</span>
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>${total().toLocaleString()}</span>
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-4">
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {loading ? "Procesando..." : "Confirmar compra"}
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          © {new Date().getFullYear()} RVMIA Store · Checkout Seguro
        </div>
      </footer>
    </div>
  );
}
