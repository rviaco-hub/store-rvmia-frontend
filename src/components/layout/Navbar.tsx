import { Link, NavLink } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";
import { useAuthStore } from "../../store/auth.store";

export default function Navbar() {
  const cartItems = useCartStore(s => s.items);
  const user = useAuthStore(s => s.user);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white shadow">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="text-xl font-bold text-green-500 tracking-wide"
          >
            RVMIA
          </Link>

          {/* LINKS DESKTOP */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-green-400 font-semibold"
                    : "hover:text-green-400"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-green-400 font-semibold"
                    : "hover:text-green-400"
                }`
              }
            >
              Productos
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-green-400 font-semibold"
                    : "hover:text-green-400"
                }`
              }
            >
              Órdenes
            </NavLink>
          </div>

          {/* ACCIONES */}
          <div className="flex items-center gap-4">
            {/* USUARIO */}
            {user && (
              <span className="hidden sm:block text-sm text-gray-300">
                {user.name}
              </span>
            )}

            {/* CARRITO */}
            <Link
              to="/cart"
              className="relative bg-green-700 hover:bg-green-800 px-3 py-2 rounded-lg transition"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
