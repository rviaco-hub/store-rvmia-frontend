import { useEffect, useState } from "react";
import api from "../../services/api";
import { useCartStore } from "../../store/cart.store";

interface Product {
  _id: string;
  name: string;
  price: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/products");

      /**
       * SOPORTE ROBUSTO:
       * - res.data puede ser array
       * - o puede venir envuelto
       */
      const list =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      setProducts(list);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>RVMIA Store</h1>

      <a href="/cart">Ver carrito</a>

      {products.length === 0 && <p>No hay productos</p>}

      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} - ${p.price}
            <button onClick={() => addItem(p)}>Agregar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
