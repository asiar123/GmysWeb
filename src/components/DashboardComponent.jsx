import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Importamos Link para las rutas
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';  // Para cargar los iconos correctamente
import L from 'leaflet';  // Importamos Leaflet para usar iconos personalizados
import carIcon from '../assets/car-icon.png';

const DashboardComponent = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const usuarioId = localStorage.getItem('usuario_id');

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await axios.get(`https://proxy-gmys.onrender.com/api/vehiculos_user?usuario_id=${usuarioId}`);
        setVehiculos(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehiculos();
  }, [usuarioId]);

  // Función para extraer las coordenadas (latitud, longitud) de la cadena "position"
  const extractCoordinates = (positionString) => {
    if (!positionString) return null;
    const [lat, lng] = positionString.replace(/[()]/g, '').split(',').map(Number);
    return { lat, lng };
  };

  // Crear un ícono personalizado
  const carMarkerIcon = new L.Icon({
    iconUrl: carIcon,  // URL del ícono de vehículo
    iconSize: [32, 32],  // Tamaño del ícono
    iconAnchor: [16, 32],  // Punto de anclaje del ícono
    popupAnchor: [0, -32],  // Punto desde el cual aparecerá el popup
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Vehículos del Usuario</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehiculos.length > 0 ? (
          vehiculos.map((vehiculo) => {
            const coordinates = extractCoordinates(vehiculo.position);

            return (
              <div key={vehiculo.vehi_id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-4">{vehiculo.vehi_placa}</h2>
                <div className="bg-gray-900 p-4 rounded-lg mb-4">
                  <p className="text-lg">
                    <span className="font-bold">Velocidad:</span> {vehiculo.velocidad} km/h
                  </p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg mb-4">
                  <p className="text-lg">
                    <span className="font-bold">Última ubicación:</span> {vehiculo.ubicacion || 'Desconocida'}
                  </p>
                  {/* Agregar las coordenadas aquí */}
                  {vehiculo.position && (
                    <p className="text-sm">
                      <span className="font-bold">Coordenadas:</span> {vehiculo.position}
                    </p>
                  )}
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-lg">
                    <span className="font-bold">Fecha:</span> {vehiculo.fecha}
                  </p>
                </div>

                {/* Mostrar el mapa si tenemos coordenadas */}
                {coordinates && (
                  <div className="mb-4">
                    <MapContainer
                      center={[coordinates.lat, coordinates.lng]}
                      zoom={13}
                      style={{ height: '200px', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker 
                        position={[coordinates.lat, coordinates.lng]} 
                        icon={carMarkerIcon}  // Usamos el ícono personalizado
                      >
                        <Popup>
                          {vehiculo.vehi_placa} - Última posición
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                )}

                {/* Enlace al detalle del vehículo */}
                <Link to={`/vehiculo/${vehiculo.vehi_id}`} className="text-blue-500 hover:text-blue-300">
                  Ver detalles
                </Link>
              </div>
            );
          })
        ) : (
          <p>No hay vehículos asociados.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
