import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleOption = (option) => {
    if (option === 'static') {
      navigate('/mapa-estatico');
    } else if (option === 'dynamic') {
      navigate('/mapa-dinamico');
    }
  };

  return (
    <div>
      <h1>Escolha o Tipo de Mapa</h1>
      <button onClick={() => handleOption('static')} style={{ margin: '10px' }}>
        Mapa Estático
      </button>
      <button onClick={() => handleOption('dynamic')} style={{ margin: '10px' }}>
        Mapa Dinâmico
      </button>
    </div>
  );
};

export default Home;
