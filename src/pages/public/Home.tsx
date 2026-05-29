import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import { useCartStore } from "../../store/cart.store";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
    title: "Marketplace Industrial Profesional",
    subtitle: "Equipos certificados y tecnología avanzada"
  },
  {
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    title: "Soluciones HVAC Empresariales",
    subtitle: "Automatización y eficiencia energética"
  }
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [slide, setSlide] = useState(0);
  const [showModal, setShowModal] = useState(true);

  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get("/products");

        setProducts(
          Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
              ? res.data
              : []
        );
      } catch (error) {
        console.error("Error cargando productos:", error);

        setProducts([]);
      }
    };

    loadProducts();

    const t = setInterval(() => {
      setSlide((p) => (p + 1) % slides.length);
    }, 5000);

    return () => clearInterval(t);
  }, []);

  return (
    <>
      {showModal && (
        <div className="modal-ad">
          <div className="box">
            <h2>🔥 Promoción exclusiva</h2>
            <p>20% OFF en equipos HVAC hoy</p>
            <br />
            <button className="btn-main" onClick={() => setShowModal(false)}>
              Ver ofertas
            </button>
          </div>
        </div>
      )}

      <div className="top-banner">
        Envío nacional gratis en compras superiores a $800.000
      </div>

      <Navbar />

      <main className="market-container">

        <section className="hero-slider">
          {slides.map((s, i) => (
            <div key={i} className={`slide ${slide === i ? "active" : ""}`}>
              <img src={s.image} />
              <div className="overlay">
                <div>
                  <h1>{s.title}</h1>
                  <p>{s.subtitle}</p>
                  <button className="btn-main">Comprar ahora</button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="categories">
          <div className="category">HVAC</div>
          <div className="category">Automatización</div>
          <div className="category">Repuestos</div>
          <div className="category">Servicios</div>
        </section>

        <section className="promos">
          <div className="promo">⚡ Ofertas Flash</div>
          <div className="promo">🚚 Envíos rápidos</div>
          <div className="promo">🔧 Soporte técnico</div>
        </section>

        <h2 style={{ margin: "30px 0", fontSize: "2rem" }}>
          Productos destacados
        </h2>

        <section className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img
                src={
                  product?.images?.[0] ||
                  "/placeholder-product.png"
                }
              />
              <div style={{ padding: "20px" }}>
                <h3>{product.name}</h3>
                <h2>
                  $
                  {Number(product?.price || 0).toLocaleString()}
                </h2>

                <button
                  className="btn-main"
                  onClick={() => addItem(product)}
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="newsletter">
          <h2>Recibe promociones exclusivas</h2>
          <input placeholder="Tu correo" />
        </section>

      </main>

      <footer className="footer">
        <div className="market-container footer-grid">
          <div>
            <h3>RVMIA</h3>
            <p>Marketplace industrial empresarial</p>
          </div>

          <div>
            <h4>Servicios</h4>
            <p>HVAC</p>
            <p>Automatización</p>
          </div>

          <div>
            <h4>Empresa</h4>
            <p>Nosotros</p>
            <p>Contacto</p>
          </div>

          <div>
            <h4>Legal</h4>
            <p>Términos</p>
            <p>Privacidad</p>
          </div>
        </div>
      </footer>
    </>
  );
}