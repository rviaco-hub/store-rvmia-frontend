import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";
import { createOrder } from "../../services/order.service";

export default function Checkout() {
  const { items, clear } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    await createOrder(items);
    clear();
    navigate("/");
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleCheckout}>Confirmar compra</button>
    </div>
  );
}
