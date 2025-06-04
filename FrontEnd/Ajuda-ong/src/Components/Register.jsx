import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiEdit } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { firstName, lastName, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await axios.post('http://localhost:5000/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>
          Junte-se ao <span style={{ color: '#2e9e8f' }}>Ajuda Ong</span>
        </h1>
        <p className="subtitle">Crie sua conta grátis!</p>

        {error && (
          <div className="error-msg">
            <FiAlertCircle />
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <FiUser />
              <input
                type="text"
                name="firstName"
                placeholder="Nome"
                value={firstName}
                onChange={onChange}
                required
                aria-label="Nome"
              />
            </div>

            <div className="input-group" style={{ flex: 1 }}>
              <FiUser />
              <input
                type="text"
                name="lastName"
                placeholder="Sobrenome"
                value={lastName}
                onChange={onChange}
                required
                aria-label="Sobrenome"
              />
            </div>
          </div>

          <div className="input-group">
            <FiMail />
            <input
              type="email"
              name="email"
              placeholder="exemplo@ajudaong.com"
              value={email}
              onChange={onChange}
              required
              aria-label="Email"
              autoComplete="email"
            />
          </div>

          {/* Senha */}
          <div className="input-group">
            <FiLock />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={onChange}
              minLength={6}
              required
              aria-label="Senha"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-btn" aria-busy={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FiEdit />
                Criar Conta
              </>
            )}
          </button>
        </form>

        <div className="links-container" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          Já tem uma conta?{' '}
          <a href="/login" className="link-register">
            Faça login aqui
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
