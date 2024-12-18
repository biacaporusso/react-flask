import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

const MapaDinamico = () => {
  useEffect(() => {
    let map;

    // Verificar se o container do mapa existe
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error("Container do mapa não encontrado.");
      return;
    }

    // Verificar se há uma instância Leaflet existente
    if (mapContainer._leaflet_id) {
      console.log("Removendo mapa existente...");
      mapContainer.innerHTML = ''; // Limpa o container
    }

    // Inicializar o mapa
    console.log("Inicializando o mapa...");
    map = L.map(mapContainer).setView([0, 0], 5);

    // Adicionar basemap
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // URL do backend Flask servindo o arquivo .tif
    const urlToGeoTiff = 'http://localhost:5000/api/get-tif';

    console.log("Buscando arquivo GeoTIFF de:", urlToGeoTiff);

    // Buscar e processar o GeoTIFF
    fetch(urlToGeoTiff)
      .then((response) => {
        if (!response.ok) throw new Error(`Erro ao buscar GeoTIFF: ${response.statusText}`);
        console.log("GeoTIFF carregado com sucesso.");
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        console.log("ArrayBuffer recebido:", arrayBuffer.byteLength, "bytes");

        parseGeoraster(arrayBuffer).then((georaster) => {
          console.log("GeoRaster carregado:", georaster);

          // Verificar dados do raster
          console.log("CRS:", georaster.projection);
          console.log("Bounds do raster:", georaster.bounds);

          const layer = new GeoRasterLayer({
            georaster,
            opacity: 0.7,
            resolution: 256,
            pixelValuesToColorFn: (values) => (values[0] > 0 ? '#0000FF' : '#FFFFFF'),
          });

          console.log("Adicionando camada ao mapa...");
          layer.addTo(map);
          map.fitBounds(layer.getBounds());
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar ou processar o GeoTIFF:", error);
      });

    // Cleanup ao desmontar o componente
    return () => {
      if (map) {
        console.log("Removendo o mapa...");
        map.remove();
      }
    };
  }, []);

  return (
    <div>
      <h1>Mapa Dinâmico</h1>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

export default MapaDinamico;
