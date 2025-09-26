import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVybnkxOTcwIiwiYSI6ImNtMWw1MDNncDA1OWIydnNuYmVub3hlZ2UifQ.dFQH1T78VNnc_ttSLnIqxA";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.43441, 39.15118], // Coordenadas personalizadas
      zoom: 15, // Ajusta el zoom según tus necesidades
    });

    // Crear el marcador estándar de Mapbox de color rojo
    new mapboxgl.Marker({ color: "red" })
      .setLngLat([-0.43441, 39.15118]) // Coordenadas
      .addTo(mapRef.current); // Añadir al mapa

    return () => mapRef.current.remove(); // Cleanup para prevenir fugas de memoria
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "15px", // Aquí agregas el borde redondeado
        overflow: "hidden", // Esto asegura que el contenido del mapa respete el borde redondeado
      }}
    />
  );
};

export default Map;
