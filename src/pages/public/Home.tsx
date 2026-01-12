import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useCartStore } from "../../store/cart.store";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        const list: Product[] =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setProducts(list);
      } catch {
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-green-500">
            RVMIA Industrial Store
          </h1>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              className="hover:text-green-400 transition"
            >
              Productos
            </Link>
            <Link
              to="/cart"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition font-semibold"
            >
              Carrito
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Soluciones industriales confiables
          </h2>
          <p className="text-green-100 max-w-2xl">
            Comercialización de productos y servicios industriales con enfoque
            técnico, seguridad y escalabilidad empresarial.
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {loading && (
          <p className="text-center text-gray-500">
            Cargando productos...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500">
            No hay productos disponibles
          </p>
        )}

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col"
            >
              {/* IMAGEN PLACEHOLDER */}
              <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                Imagen industrial
              </div>

              {/* INFO */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="mt-auto">
                  <p className="text-xl font-bold text-green-700 mb-4">
                    ${product.price.toLocaleString()}
                  </p>

                  <button
                    onClick={() => addItem(product)}
                    className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          © {new Date().getFullYear()} RVMIA Store · Plataforma Industrial
        </div>
      </footer>
    </div>
  );
}
