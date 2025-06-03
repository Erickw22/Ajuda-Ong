import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiHome, FiLogOut, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import '../styles/Profile.css';

import ToastService from '../assets/toastService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        ToastService.error('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      ToastService.loading('loading-profile', 'Carregando dados do perfil...');
      try {
        const res = await axios.get('http://localhost:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
        });
        ToastService.dismiss('loading-profile');
      } catch (err) {
        ToastService.dismiss('loading-profile');
        if (err.response?.status === 401) {
          ToastService.error('Sessão expirada. Faça login novamente.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          ToastService.error('Erro ao carregar dados do usuário.');
          console.error('Erro ao buscar perfil:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setLoading(true);
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      ToastService.loading('loading-profile', 'Recarregando dados...');
      try {
        const res = await axios.get('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
        });
        ToastService.dismiss('loading-profile');
      } catch {
        ToastService.dismiss('loading-profile');
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');

    if (!token) {
      ToastService.error('Usuário não autenticado.');
      setSaving(false);
      return;
    }

    ToastService.loading('saving-profile', 'Salvando alterações...');
    try {
      await axios.patch(
        'http://localhost:5000/auth/me',
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      ToastService.dismiss('saving-profile');
      ToastService.success('Perfil atualizado com sucesso!');
      setEditing(false);
    } catch (err) {
      ToastService.dismiss('saving-profile');
      ToastService.error(
        err.response?.data?.msg ||
          'Erro ao atualizar perfil. Verifique os dados e tente novamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-container">Carregando...</div>;
  }

  return (
    <div className="profile-container" role="main">
      <div className="profile-card" aria-live="polite">
        <h1 className="profile-title">Perfil</h1>

        {userData ? (
          <div className="profile-info">
            <p>
              <FiUser aria-hidden="true" /> <strong>Nome:</strong>{' '}
              {editing ? (
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  aria-label="Nome"
                  disabled={saving}
                />
              ) : (
                userData.firstName
              )}
            </p>
            <p>
              <FiUser aria-hidden="true" /> <strong>Sobrenome:</strong>{' '}
              {editing ? (
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  aria-label="Sobrenome"
                  disabled={saving}
                />
              ) : (
                userData.lastName
              )}
            </p>
            <p>
              <FiMail aria-hidden="true" /> <strong>Email:</strong>{' '}
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  aria-label="Email"
                  disabled={saving}
                />
              ) : (
                userData.email
              )}
            </p>
          </div>
        ) : (
          <p>Dados do usuário indisponíveis.</p>
        )}

        <div className="profile-buttons">
          {!editing ? (
            <>
              <button
                onClick={handleEditToggle}
                className="profile-button"
                aria-label="Editar perfil"
              >
                ✏️ Editar
              </button>
              <button
                onClick={handleGoHome}
                className="profile-button"
                aria-label="Voltar para a página inicial"
              >
                <FiHome aria-hidden="true" /> Voltar para Home
              </button>
              <button
                onClick={handleLogout}
                className="profile-button logout-button"
                aria-label="Sair da conta"
              >
                <FiLogOut aria-hidden="true" /> Sair
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="profile-button"
                aria-label="Salvar alterações"
                disabled={saving}
              >
                {saving ? 'Salvando...' : (
                  <>
                    <FiCheck aria-hidden="true" /> Salvar
                  </>
                )}
              </button>
              <button
                onClick={handleCancelEdit}
                className="profile-button logout-button"
                aria-label="Cancelar edição"
                disabled={saving}
              >
                <FiX aria-hidden="true" /> Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
