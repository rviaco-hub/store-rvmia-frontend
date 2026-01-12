import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import api from "../../services/api";
import { useAuthStore } from "../../store/auth.store";

type Mode = "login" | "register";

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
    setError(null);
    setLoading(true);

    try {
      let data;

      if (mode === "login") {
        data = await login({ email, password });
      } else {
        const res = await api.post("/auth/register", {
          name,
          email,
          password
        });
        data = res.data;
      }

      // Guarda token y usuario
      auth.login(data);

      // Redirección según rol
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error al autenticar el usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{mode === "login" ? "Login" : "Registro"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {mode === "register" && (
        <input
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading
          ? "Procesando..."
          : mode === "login"
          ? "Entrar"
          : "Registrarse"}
      </button>

      <hr />

      {mode === "login" ? (
        <p>
          ¿No tienes cuenta?{" "}
          <button onClick={() => setMode("register")}>
            Regístrate
          </button>
        </p>
      ) : (
        <p>
          ¿Ya tienes cuenta?{" "}
          <button onClick={() => setMode("login")}>
            Inicia sesión
          </button>
        </p>
      )}
    </div>
  );
}
