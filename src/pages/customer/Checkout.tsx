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
        productId: item._id,
        quantity: item.quantity
      }));

      console.log("CK2,1. ", payload);
      

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
      <div className="checkout-empty">
        <div className="checkout-empty-card">
          <h2>Tu carrito está vacío</h2>
          <p>No hay productos listos para procesar.</p>

          <button
            onClick={() => navigate("/")}
            className="checkout-back-btn"
          >
            Explorar productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* HEADER */}
      <header className="checkout-header">
        <div className="checkout-container">
          <h1>Checkout seguro</h1>
          <span>{items.length} productos</span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="checkout-main checkout-container">
        {/* LISTA */}
        <section className="checkout-items">
          {items.map(item => (
            <div key={item._id} className="checkout-item-card">
              <div className="checkout-item-left">
                <div className="checkout-product-avatar">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h2>{item.name}</h2>
                  <p>Cantidad: {item.quantity}</p>
                </div>
              </div>

              <div className="checkout-item-price">
                ${(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </section>

        {/* RESUMEN */}
        <aside className="checkout-summary">
          <h3>Resumen</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total().toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Impuestos</span>
            <span>Backend</span>
          </div>

          <div className="summary-row">
            <span>Envío</span>
            <span>Gratis</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>${total().toLocaleString()}</span>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="checkout-confirm-btn"
          >
            {loading ? "Procesando..." : "Confirmar compra"}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="checkout-return-btn"
          >
            Volver al carrito
          </button>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="checkout-footer">
        © {new Date().getFullYear()} RVMIA Store · Checkout Empresarial
      </footer>
    </div>
  );
}