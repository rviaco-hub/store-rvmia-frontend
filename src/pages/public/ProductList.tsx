import { useEffect, useState } from "react";
import api from "../../services/api";
import { useCartStore } from "../../store/cart.store";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        /**
         * SOPORTE ROBUSTO BACKEND
         * - array directo
         * - data envuelta
         */
        const list: Product[] =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setProducts(list);
      } catch {
        setError("No se pudieron cargar los productos");
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-green-500">
            Gestión de Productos
          </h1>
        </div>
      </header>

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
            No hay productos registrados
          </p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => {
            const outOfStock = product.stock === 0;

            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col overflow-hidden"
              >
                {/* IMAGEN */}
                <div className="h-44 bg-gray-200 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Imagen no disponible
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-semibold text-lg mb-1">
                    {product.name}
                  </h2>

                  {product.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-auto">
                    <p className="text-xl font-bold text-green-700 mb-1">
                      ${product.price.toLocaleString()}
                    </p>

                    <p
                      className={`text-sm mb-3 ${
                        outOfStock
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      Stock: {product.stock}
                    </p>

                    <button
                      onClick={() => addItem(product)}
                      disabled={outOfStock}
                      className={`w-full py-2 rounded-lg font-semibold transition
                        ${
                          outOfStock
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800 text-white"
                        }`}
                    >
                      {outOfStock
                        ? "Sin stock"
                        : "Agregar al carrito"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          © {new Date().getFullYear()} RVMIA Store · Gestión Industrial
        </div>
      </footer>
    </div>
  );
}
