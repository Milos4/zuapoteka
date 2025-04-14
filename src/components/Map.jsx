import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Postavi dimenzije mape
const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 44.547118, // Unesi tačnu latitudu tvoje adrese
  lng: 19.210278, // Unesi tačnu longitudu tvoje adrese
};

const Map = () => {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
