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
    <div className="login-page">
      <div className="login-container">

        {/* PANEL IZQUIERDO */}
        <div className="login-left">
          <h1>RVMIA Industrial Store</h1>

          <p>
            Productos y servicios industriales confiables, seguros y escalables.
          </p>

          <ul>
            <li>✔ Comercio industrial B2B</li>
            <li>✔ Servicios técnicos especializados</li>
            <li>✔ Seguridad y control empresarial</li>
          </ul>
        </div>

        {/* FORMULARIO */}
        <div className="login-right">
          <h2>
            {mode === "login"
              ? "Acceso a la plataforma"
              : "Registro empresarial"}
          </h2>

          <p className="subtitle">
            {mode === "login"
              ? "Ingrese sus credenciales para continuar"
              : "Cree su cuenta para acceder al sistema"}
          </p>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <div className="form-group">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : mode === "login"
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
            </button>
          </div>

          <div className="switch-mode">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?
                <button onClick={() => setMode("register")}>
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?
                <button onClick={() => setMode("login")}>
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