import { useCartStore } from "../../store/cart.store";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, removeItem } = useCartStore();

  return (
    <div>
      <h2>Carrito</h2>

      {items.length === 0 && <p>Carrito vacío</p>}

      <ul>
        {items.map(i => (
          <li key={i._id}>
            {i.name} x {i.quantity} = ${i.price * i.quantity}
            <button onClick={() => removeItem(i._id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <Link to="/checkout">Ir a pagar</Link>
    </div>
  );
}
