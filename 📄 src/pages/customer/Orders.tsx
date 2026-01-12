import { useEffect, useState } from "react";
import { orderService } from "../../../src/services/order.service";

interface OrderItem {
  product?: { name: string };
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await orderService.getMyOrders();

        // ⚠️ protección contra respuestas inesperadas
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError("No se pudieron cargar las órdenes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p>{error}</p>;

  if (orders.length === 0) {
    return <p>No tienes órdenes aún.</p>;
  }

  return (
    <div>
      <h2>Mis Órdenes</h2>

      {orders.map(order => (
        <div key={order._id}>
          <hr />
          <p><b>ID:</b> {order._id}</p>
          <p><b>Fecha:</b> {new Date(order.createdAt).toLocaleString()}</p>
          <p><b>Estado:</b> {order.status}</p>
          <p><b>Total:</b> ${order.total}</p>

          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.product?.name ?? "Producto eliminado"} × {item.quantity} — $
                {item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
