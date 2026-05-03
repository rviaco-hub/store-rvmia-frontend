import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";

export default function Cart() {
  const { items, removeItem, clear } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">

      <header className="cart-header">
        <div className="market-container">
          <h1>Carrito de compras</h1>
        </div>
      </header>

      <main className="market-container cart-main">
        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío</p>

            <Link to="/" className="btn-main">
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            <div className="cart-items">
              {items.map(item => (
                <div key={item._id} className="cart-item">

                  <div className="item-info">
                    <h2>{item.name}</h2>

                    <p>
                      Precio unitario:
                      ${item.price.toLocaleString()}
                    </p>

                    <p>
                      Cantidad: {item.quantity}
                    </p>
                  </div>

                  <div className="item-total">
                    <div className="price">
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                    >
                      Eliminar
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h3>Resumen</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>Impuestos</span>
                <span>Checkout</span>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              <Link
                to="/checkout"
                className="checkout-btn"
              >
                Ir a pagar
              </Link>

              <button
                className="clear-btn"
                onClick={clear}
              >
                Vaciar carrito
              </button>
            </aside>

          </div>
        )}
      </main>

      <footer className="cart-footer">
        © {new Date().getFullYear()} RVMIA Store · Comercio Industrial
      </footer>

    </div>
  );
}