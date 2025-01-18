"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import L from "leaflet";

export default function Map({ properties }) {
  const centerPosition = [18.5642, 73.7769]; // Default center position

  const getIcon = () =>
    new L.Icon({
      iconUrl: "/marker5.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -30],
    });

  // Zone configuration
  const zones = [
    { radius: 500, color: "red" },
    { radius: 1000, color: "orange" },
    { radius: 2000, color: "yellow" },
  ];

  return (
    <div className="flex justify-center" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={centerPosition}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((loc, index) => {
          const { latitude, longitude } = loc.location || {};
          if (!latitude || !longitude) return null;

          return (
            <Marker
              position={[latitude, longitude]}
              key={index}
              icon={getIcon()}
            >
              <Popup>
                <p>
                  <strong>{loc.name}</strong>
                  <br />
                </p>
              </Popup>

              {/* Concentric circles for each marker */}
              {zones.map((zone, zoneIndex) => (
                <Circle
                  key={`${index}-${zoneIndex}`}
                  center={[latitude, longitude]}
                  radius={zone.radius}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.3,
                  }}
                />
              ))}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}


// "use client";

// import { MapContainer, Marker, Popup, TileLayer, Circle } from "react-leaflet";

// export default function Map({ properties }) {
//   return (
//     <MapContainer
//       center={[properties[0]?.location.latitude || 0, properties[0]?.location.longitude || 0]}
//       zoom={11}
//       scrollWheelZoom={true}
//       style={{ height: "500px", width: "100%" }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
//           OpenStreetMap
//         </a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {properties.map((property, index) => (
//         <Marker key={index} position={[property.location.latitude, property.location.longitude]}>
//           <Popup>{property.name}</Popup>
//           {/* Concentric circles for each marker */}
//           {property.zones && property.zones.map((zone, zoneIndex) => (
//             <Circle
//               key={`${index}-${zoneIndex}`}
//               center={[property.location.latitude, property.location.longitude]}
//               radius={zone.radius}
//               pathOptions={{
//                 color: zone.color,
//                 fillColor: zone.color,
//                 fillOpacity: 0.3,
//               }}
//             />
//           ))}
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }