import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useCartStore } from "../../store/cart.store";
import ImageCarousel from "../../components/layout/ImageCarousel";
import AdSlider from "../../components/layout/AdSlider";


interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
}

const ads = [
  {
    id: 1,
    image: "/3-removebg-preview.png",
    title: "Equipos Industriales",
    subtitle: "Alta calidad certificada",
  },
  {
    id: 2,
    image: "/4-removebg-preview.png",
    title: "Mantenimiento Profesional",
    subtitle: "Servicio técnico especializado",
  },
  {
    id: 3,
    image: "/logoeric2.png",
    title: "Soluciones HVAC",
    subtitle: "Optimización energética",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [socio, setSocio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        const list: Product[] =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
              ? res.data.data
              : [];

        setProducts(list);
      } catch {
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className=" pt-24 min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER */}
      <header className={`
    fixed top-0 left-0 w-full z-50 transition-all duration-300  text-white
    ${scrolled
          ? "bg-gray-900/80 backdrop-blur-md shadow-lg"
          : "bg-gray-900"
        }
  `}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src="/3-removebg-preview.png"
            alt="Logo"
            className="h-12
            sm:h-14
            md:h-16 
            lg:h-20 
            xl:h-24
            w-auto 
            object-contain 
            select-none 
            pointer-events-none"
          />
          <nav className="flex items-center gap-4 text-sm">
            {
              socio ? 
              <Link to="/Socios" className="hover:text-green-400 transition">
              {socio}
            </Link>
              :
              <Link to="/Socios" className="hover:text-green-400 transition">
              Login / registro de socio
            </Link>
            }
            <Link
              to="/cart"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition font-semibold"
            >
              Mis productos
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}

           <section className="bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">

    {/* BOTONES */}
    <div className="flex flex-wrap justify-center items-center gap-2 w-full">

      <a
        href="tel:+576043604440"
        className="text-xs sm:text-sm bg-white text-green-800 font-medium px-1 py-1.5 rounded-md hover:bg-gray-100 transition"
      >
        ☎️ Llamar
      </a>

      <a
        href="#"
        className="text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1.5 rounded-md transition"
      >
        👉 Comunidad
      </a>

      <a
        href="https://wa.me/576043604440"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs sm:text-sm bg-green-800 hover:bg-green-900 text-white font-medium px-3 py-1.5 rounded-md transition"
      >
        💬 WhatsApp
      </a>

    

      <a
        href="https://facebook.com"
        target="_blank"
        className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition text-sm"
      >
        📘
      </a>

      <a
        href="https://instagram.com"
        target="_blank"
        className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition text-sm"
      >
        📸
      </a>

      <a
        href="https://linkedin.com"
        target="_blank"
        className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition text-sm"
      >
        💼
      </a>

    </div>

  </div>
</section>

      {/* SLIDER PUBLICIDAD */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <AdSlider fallbackSlides={ads} />
      </div>


      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {loading && (
          <p className="text-center text-gray-500">
            Cargando productos...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500">
            No hay productos disponibles
          </p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col"
            >
              {/* 👇 CARRUSEL */}
              <ImageCarousel images={product.images || []} />

              {/* INFO */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="mt-auto">
                  <p className="text-xl font-bold text-green-700 mb-4">
                    ${product.price.toLocaleString()}
                  </p>

                  <button
                    onClick={() => addItem(product)}
                    className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          © {new Date().getFullYear()} RVMIA Store · Plataforma Industrial
        </div>
      </footer>
    </div>
  );
}