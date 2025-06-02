import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import CriarPost from './pages/CriarPost';
import Perfil from './pages/Perfil';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/CriarPost" element={<CriarPost />} />
        <Route path="/Perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
};

export default App;