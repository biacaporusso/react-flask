import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Home from "./components/Home";
import MapaEstatico from "./components/MapaEstatico";
import MapaDinamico from "./components/MapaDinamico";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mapa-estatico" element={<MapaEstatico />} />
        <Route path="/mapa-dinamico" element={<MapaDinamico />} />
      </Routes>
    </Router>
  );
}

export default App;
