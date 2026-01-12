import { useEffect, useState } from "react";
import api from "../../services/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err: any) {
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product._id}
            className="border rounded shadow p-4 flex flex-col"
          >
            <div className="h-40 bg-gray-200 mb-3 flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">Sin imagen</span>
              )}
            </div>

            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-700">
              ${product.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Stock: {product.stock}
            </p>

            <button
              className="mt-auto bg-green-600 text-white py-1 rounded hover:bg-green-700 transition"
              disabled={product.stock === 0}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
