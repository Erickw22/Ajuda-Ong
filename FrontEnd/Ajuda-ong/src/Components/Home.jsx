import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/Home.css";
import axios from "axios";
import logo from '../assets/logo02.png';


import ToastService from "../assets/toastService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const api = axios.create({
  baseURL: "http://localhost:5000/ongs",
});

const Home = () => {
  const [ongs, setOngs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOngs = async () => {
      setLoading(true);
      ToastService.loading("loading-toast", "Carregando lista de ONGs...");
      try {
        const res = await api.get("/list");
        setOngs(res.data);
        ToastService.dismiss("loading-toast");
        ToastService.success("Lista de ONGs carregada com sucesso!");
      } catch (err) {
        ToastService.dismiss("loading-toast");
        console.error(
          "Erro ao buscar ONGs:",
          err.response || err.message || err
        );
        ToastService.error(
          "Erro ao carregar a lista de ONGs. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOngs();
  }, []);

  return (
    <div className="home-wrapper">
      <nav className="nav fixed-nav">
        <Link className="logo" to="/">
          <img src={logo} alt="Ajude uma ONG" style={{ height: '90px' }} />
        </Link>
        <div className="nav-buttons">
          <Link to="/profile" className="btn-base btn-link">
            Perfil
          </Link>
        </div>
      </nav>

      <main className="container">
        <section aria-labelledby="mapa-ongs">
          <h2 id="mapa-ongs" className="title-secondary">
            Mapa de ONGs de Proteção Animal
          </h2>

          <MapContainer
            center={[-8.0476, -34.877]}
            zoom={10}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {ongs.map(
              (ong) =>
                ong.location?.lat &&
                ong.location?.lng && (
                  <Marker
                    key={ong._id}
                    position={[ong.location.lat, ong.location.lng]}
                  >
                    <Popup>
                      <strong>{ong.name}</strong>
                      <br />
                      {ong.address}
                      <br />
                      {ong.phone}
                    </Popup>
                  </Marker>
                )
            )}
          </MapContainer>
        </section>

        <section aria-labelledby="lista-ongs">
          <h2 id="lista-ongs" className="title-secondary">
            Lista de ONGs
          </h2>
          <div className="ngo-grid">
            {loading ? (
              <p>Carregando ONGs...</p>
            ) : ongs.length > 0 ? (
              ongs.map((ong) => (
                <article key={ong._id} className="highlight-card">
                  <h3 className="ngo-name">{ong.name}</h3>
                  <p>
                    <strong>Endereço:</strong> {ong.address}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {ong.phone}
                  </p>
                  <Link to={`/ong/${ong._id}`} className="btn-link">
                    Ver detalhes
                  </Link>
                </article>
              ))
            ) : (
              <p>Nenhuma ONG encontrada.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Ajude-ong. Todos os direitos
        reservados.
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Home;
