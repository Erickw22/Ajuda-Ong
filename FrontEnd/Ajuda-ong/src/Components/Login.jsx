import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import "../styles/Login.css";

import ToastService from "../assets/toastService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    ToastService.loading("login-loading", "Validando credenciais...");
    try {
      const res = await axios.post("http://localhost:5000/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      ToastService.dismiss("login-loading");
      ToastService.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (err) {
      ToastService.dismiss("login-loading");
      ToastService.error(
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
            aria-disabled={isLoading}
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
          <Link to="/register" className="link-register">
            Não tem uma conta? Criar conta grátis!
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
