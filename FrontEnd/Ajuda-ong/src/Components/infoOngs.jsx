import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/InfoOngs.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ToastService from "../assets/toastService";

const api = axios.create({
  baseURL: "http://localhost:5000/ongs",
});

const InfoOngs = () => {
  const { id } = useParams();
  const [ong, setOng] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOng = async () => {
      setLoading(true);
      ToastService.loading("loading-ong", "Carregando detalhes da ONG...");
      try {
        const res = await api.get(`/details/${id}`);
        setOng(res.data);
        ToastService.dismiss("loading-ong");
        ToastService.success("Detalhes carregados com sucesso!");
      } catch (err) {
        ToastService.dismiss("loading-ong");
        ToastService.error("Erro ao carregar os detalhes da ONG. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchOng();
  }, [id]);

  const handleBack = () => {
    navigate("/home");
  };

  if (loading) return <p>Carregando informações da ONG...</p>;
  if (!ong) return <p>Detalhes da ONG não encontrados.</p>;

  return (
    <div className="info-ong-wrapper">
      <h2>{ong.name}</h2>
      <p>
        <strong>Endereço:</strong> {ong.address}
      </p>
      <p>
        <strong>Telefone:</strong> {ong.phone}
      </p>
      <p>
        <strong>Email:</strong> {ong.email || "Não informado"}
      </p>
      <p>
        <strong>Descrição:</strong> {ong.description || "Sem descrição"}
      </p>

      <div className="social-media">
        <h3>Redes Sociais</h3>
        {ong.socialMedia ? (
          <>
            {ong.socialMedia.instagram && (
              <p>
                <strong>Instagram: </strong>
                <a
                  href={ong.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ong.socialMedia.instagram}
                </a>
              </p>
            )}
            {ong.socialMedia.facebook && (
              <p>
                <strong>Facebook: </strong>
                <a
                  href={ong.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ong.socialMedia.facebook}
                </a>
              </p>
            )}
            {ong.socialMedia.twitter && (
              <p>
                <strong>Twitter: </strong>
                <a
                  href={ong.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ong.socialMedia.twitter}
                </a>
              </p>
            )}
            {!ong.socialMedia.instagram &&
              !ong.socialMedia.facebook &&
              !ong.socialMedia.twitter && <p>Não informado</p>}
          </>
        ) : (
          <p>Não informado</p>
        )}
      </div>

      <p>
        <strong>Pix:</strong> {ong.pixKey || "Não informado"}
      </p>

      <button className="btn-base" onClick={handleBack}>
        Voltar
      </button>

      <ToastContainer />
    </div>
  );
};

export default InfoOngs;
