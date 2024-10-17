import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import carIcon from '../assets/car-icon.png';  
import startIcon from '../assets/custom_pin2.png';  
import endIcon from '../assets/custom_pin3.png';  
import Modal from 'react-modal';

Modal.setAppElement('#root');

const VehiculoDetailComponent = () => {
  const { vehiId } = useParams();
  const [recorrido, setRecorrido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPunto, setSelectedPunto] = useState(null);

  const carMarkerIcon = new L.Icon({
    iconUrl: carIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const startMarkerIcon = new L.Icon({
    iconUrl: startIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const endMarkerIcon = new L.Icon({
    iconUrl: endIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    const fetchRecorrido = async () => {
      try {
        const response = await axios.get(`/api/vehiculo_recorrido?vehi_id=${vehiId}&fecha_i=2024-10-16&fecha_f=2024-10-16`);
        const data = response.data;

        const puntosValidos = data.filter(punto => punto.velocidad > 0);
        const puntosFiltrados = filtrarPuntosFrecuentes(puntosValidos, 120);

        setRecorrido(puntosFiltrados);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicle route:", error);
        setLoading(false);
      }
    };

    fetchRecorrido();
  }, [vehiId]);

  const extractCoordinates = (positionString) => {
    if (!positionString) return null;
    const [lat, lng] = positionString.replace(/[()]/g, '').split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
  };

  const filtrarPuntosFrecuentes = (puntos, tiempoMinimo) => {
    const resultado = [];
    let ultimoTiempo = null;

    puntos.forEach(punto => {
      const fechaActual = new Date(punto.dia.replace(/_/g, ' '));

      if (!ultimoTiempo || (fechaActual - ultimoTiempo) / 1000 > tiempoMinimo) {
        resultado.push(punto);
        ultimoTiempo = fechaActual;
      }
    });

    return resultado;
  };

  const abrirModal = (punto) => {
    setSelectedPunto(punto);
  };

  const cerrarModal = () => {
    setSelectedPunto(null);
  };

  const polylineCoordinates = recorrido.map(punto => extractCoordinates(punto.position));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Detalles del Vehículo {vehiId}</h1>

      {loading ? (
        <p>Cargando detalles del vehículo...</p>
      ) : (
        <div>
          {recorrido.length > 0 ? (
            <div className="mb-4">
              <MapContainer
                center={extractCoordinates(recorrido[0].position)}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                <Marker
                  position={extractCoordinates(recorrido[0].position)}
                  icon={startMarkerIcon}
                >
                  <Popup>
                    {`Inicio del recorrido en ${recorrido[0].dia}, Velocidad: ${recorrido[0].velocidad} km/h`}
                  </Popup>
                </Marker>

                <Marker
                  position={extractCoordinates(recorrido[recorrido.length - 1].position)}
                  icon={endMarkerIcon}
                >
                  <Popup>
                    {`Fin del recorrido en ${recorrido[recorrido.length - 1].dia}, Velocidad: ${recorrido[recorrido.length - 1].velocidad} km/h`}
                  </Popup>
                </Marker>

                {recorrido.map((punto, index) => {
                  const coordinates = extractCoordinates(punto.position);
                  return coordinates && (
                    <Marker
                      key={index}
                      position={coordinates}
                      icon={carMarkerIcon}
                      eventHandlers={{
                        click: () => abrirModal(punto),
                      }}
                    >
                      <Popup>
                        {`Posición en ${punto.dia}, Velocidad: ${punto.velocidad} km/h`}
                      </Popup>
                    </Marker>
                  );
                })}

                {/* Dibujar la línea de la ruta */}
                <Polyline positions={polylineCoordinates} color="blue" />
              </MapContainer>
            </div>
          ) : (
            <p>No hay recorrido disponible para este vehículo o no se registraron movimientos.</p>
          )}

          {selectedPunto && (
            <Modal
              isOpen={!!selectedPunto}
              onRequestClose={cerrarModal}
              contentLabel="Detalles del Punto"
              className="modal-class"
              overlayClassName="modal-overlay"
            >
              <h2 className="text-2xl font-bold mb-4">Detalles del Punto</h2>
              <p><strong>Fecha:</strong> {selectedPunto.dia}</p>
              <p><strong>Velocidad:</strong> {selectedPunto.velocidad} km/h</p>
              <p><strong>Posición:</strong> {selectedPunto.position}</p>
              <button onClick={cerrarModal} className="bg-red-500 text-white px-4 py-2 mt-4">Cerrar</button>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default VehiculoDetailComponent;
