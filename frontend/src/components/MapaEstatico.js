import React, { useEffect, useState } from 'react';

const MapaEstatico = () => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    // Buscar a imagem do backend
    fetch('http://localhost:5000/api/tif-to-image')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao carregar a imagem');
        }
        return response.blob(); // Obter os dados como blob
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setImageSrc(url); // Atualizar o estado com a URL da imagem
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Visualização do Arquivo .TIF</h1>
      {imageSrc ? (
        <img src={imageSrc} alt="Visualização do Raster" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default MapaEstatico;
