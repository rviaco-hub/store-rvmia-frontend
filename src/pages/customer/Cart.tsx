import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";

export default function Cart() {
  const { items, removeItem, clear } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-green-500">
            Carrito de compras
          </h1>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {items.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="mb-4">Tu carrito está vacío</p>
            <Link
              to="/"
              className="inline-block bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LISTA */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* INFO */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Precio unitario: ${item.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>

                  {/* TOTAL ITEM */}
                  <div className="text-right">
                    <p className="font-bold text-green-700 text-lg">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
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
                <span>${subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span>Impuestos</span>
                <span>Calculado en checkout</span>
              </div>

              <hr className="mb-4" />

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full text-center bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition"
              >
                Ir a pagar
              </Link>

              <button
                onClick={clear}
                className="mt-4 w-full text-sm text-gray-500 hover:underline"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          © {new Date().getFullYear()} RVMIA Store · Comercio Industrial
        </div>
      </footer>
    </div>
  );
}
