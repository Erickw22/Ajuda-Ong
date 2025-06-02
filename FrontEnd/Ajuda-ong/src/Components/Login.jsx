import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiLogIn, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.msg || "Credenciais inválidas ou erro no servidor"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card" role="main" aria-label="Formulário de login">
        <header>
          <h1>Bem-vindo ao Ajude uma Ong</h1>
          <p className="subtitle">Faça login para acessar sua conta</p>
        </header>

        {error && (
          <div className="error-msg" role="alert">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="input-group">
            <FiMail />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="exemplo@ajudaong.com"
              value={email}
              onChange={onChange}
              required
              aria-required="true"
              aria-label="Email"
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <FiLock />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={onChange}
              required
              aria-required="true"
              aria-label="Senha"
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-btn"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FiLogIn />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="links-container">
          <a href="/register" className="link-register" tabIndex={0}>
            Não tem uma conta? Criar conta grátis!
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
