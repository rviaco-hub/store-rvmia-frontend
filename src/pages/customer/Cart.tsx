import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";
import "./Cart.scss";

export default function Cart() {
  const {
    items,
    removeItem,
    clear
  } = useCartStore();

  const subtotal =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        item.price *
          item.quantity,
      0
    );

  return (
    <div className="cart-page">
      <header className="cart-header">
        <div className="market-container">
          <h1>
            Carrito de
            compras
          </h1>
        </div>
      </header>

      <main className="market-container cart-main">
        {items.length ===
        0 ? (
          <div className="cart-empty">
            <p>
              Tu carrito
              está vacío
            </p>

            <Link
              to="/"
              className="checkout-btn"
            >
              Ver
              productos
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {items.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item._id
                    }
                    className="cart-item"
                  >
                    <img
                      src={
                        item
                          .images?.[0]
                      }
                      alt={
                        item.name
                      }
                    />

                    <div className="item-info">
                      <h3>
                        {
                          item.name
                        }
                      </h3>

                      <p className="price">
                        Precio
                        unitario:
                        $
                        {item.price.toLocaleString()}
                      </p>

                      <div className="quantity">
                        <span>
                          Cantidad:{" "}
                          {
                            item.quantity
                          }
                        </span>
                      </div>
                    </div>

                    <div className="item-total">
                      <div className="price">
                        $
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeItem(
                            item._id
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            <aside className="cart-summary">
              <h2>
                Resumen
              </h2>

              <div className="summary-row">
                <span>
                  Subtotal
                </span>

                <span>
                  $
                  {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="summary-row">
                <span>
                  Impuestos
                </span>

                <span>
                  Incluidos
                </span>
              </div>

              <div className="summary-row total">
                <span>
                  Total
                </span>

                <span>
                  $
                  {subtotal.toLocaleString()}
                </span>
              </div>

              <Link
                to="/checkout"
                className="checkout-btn"
              >
                Ir a pagar
              </Link>

              <button
                className="checkout-btn"
                onClick={
                  clear
                }
                style={{
                  marginTop:
                    "12px",
                  background:
                    "#f3f4f6",
                  color:
                    "#111827"
                }}
              >
                Vaciar
                carrito
              </button>
            </aside>
          </div>
        )}
      </main>

      <footer className="cart-footer">
        ©{" "}
        {new Date().getFullYear()}{" "}
        RVMIA Store ·
        Comercio
        Industrial
      </footer>
    </div>
  );
}