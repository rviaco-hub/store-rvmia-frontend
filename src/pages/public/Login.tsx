import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import api from "../../services/api";
import { useAuthStore } from "../../store/auth.store";

type Mode = "login" | "register";

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  };
}

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuthStore();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (mode === "register" && !name)) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let data: AuthResponse;

      if (mode === "login") {
        data = await login({ email, password });
      } else {
        const res = await api.post<AuthResponse>("/auth/register", {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        });
        data = res.data;
      }

      auth.login(data);

      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Credenciales inválidas o error del servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-gray-100 rounded-2xl shadow-2xl overflow-hidden">

        {/* PANEL IZQUIERDO */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-green-700 to-green-900 p-10 text-white">
          <h1 className="text-4xl font-bold mb-4">
            RVMIA Industrial Store
          </h1>
          <p className="text-lg text-green-100">
            Productos y servicios industriales confiables, seguros y escalables.
          </p>
          <ul className="mt-6 space-y-3 text-green-200 text-sm">
            <li>✔ Comercio industrial B2B</li>
            <li>✔ Servicios técnicos especializados</li>
            <li>✔ Seguridad y control empresarial</li>
          </ul>
        </div>

        {/* FORMULARIO */}
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {mode === "login" ? "Acceso a la plataforma" : "Registro empresarial"}
          </h2>
          <p className="text-gray-500 mb-6">
            {mode === "login"
              ? "Ingrese sus credenciales para continuar"
              : "Cree su cuenta para acceder al sistema"}
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-600 focus:outline-none"
              />
            )}

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-600 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-600 focus:outline-none"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold py-3 transition disabled:opacity-60"
            >
              {loading
                ? "Procesando..."
                : mode === "login"
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-green-700 font-semibold hover:underline"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-green-700 font-semibold hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
