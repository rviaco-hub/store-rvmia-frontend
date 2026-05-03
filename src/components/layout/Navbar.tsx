import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";
import logo from '../../assets/rvmia-removebg-preview.png'
import { User, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const cart = useCartStore(s => s.items);

  return (
    <header className="navbar">
      <div className="market-container nav-wrapper">

        <Link to="/" className="logo">
          <img
            src={logo}
            alt="RVMIA"
          />
        </Link>

        <div className="search">
          <input placeholder="Buscar productos industriales..." />
        </div>

        <div className="actions">
  <Link to="/login" className="action-icon">
    <User size={20} />
    <span>Cuenta</span>
  </Link>

  <Link to="/cart" className="action-icon cart-icon">
    <ShoppingCart size={20} />
    <span className="cart-badge">{cart.length}</span>
  </Link>
</div>

      </div>
    </header>
  );
}