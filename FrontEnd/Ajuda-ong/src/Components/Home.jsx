import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Home.css";
import axios from 'axios';

// Configuração da API
const api = axios.create({
  baseURL: 'http://localhost:5000/posts' // Ajuste conforme necessário
});

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/');
        setPosts(res.data);
      } catch (err) {
        console.error('Erro ao buscar posts:', err);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login'); 
  };

  return (
    <div className="home-wrapper">
      {/* Navbar fixa */}
      <nav className="nav fixed-nav" aria-label="Navegação principal">
        <Link className="logo" to="/">Ajude uma Ong</Link>
        <div className="nav-buttons">
          <button className="btn-base btn-link" onClick={handleLogout} aria-label="Sair da conta">
            Sair
          </button>
          <Link to="/Profile" className="btn-base btn-link" aria-label="Página do perfil do usuário">
            Perfil
          </Link>
        </div>
      </nav>

      <main className="container">
        {/* Banner do blog ou imagem ilustrativa */}
        <section className="banner" aria-label="Banner do blog">
          <img
            src="https://via.placeholder.com/1200x300.png?text=Bem-vindo+ao+Blog"
            alt="Banner com texto Bem-vindo ao Blog"
          />
        </section>

        {/* Posts criados Recentes */}
        <section aria-labelledby="posts-recentes">
          <h2 id="posts-recentes" className="title-secondary">Posts Recentes</h2>
          <div className="ngo-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post._id} className="highlight-card" aria-label={`Post: ${post.title}`}>
                  <h3 className="ngo-name">{post.title}</h3>
                  <p>{post.content}</p>
                  <small>Por: {post.author?.firstName || 'Anônimo'}</small>
                  <br />
                  <Link to={`/post/${post._id}`} className="btn-link" aria-label={`Leia mais sobre ${post.title}`}>
                    Leia mais
                  </Link>
                </article>
              ))
            ) : (
              <p>Nenhum post encontrado.</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        &copy; {new Date().getFullYear()} Ajude-ong. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Home;
