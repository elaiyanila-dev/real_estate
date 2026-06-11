import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function MapView({ properties }) {
  const center = properties.length ? [properties[0].latitude, properties[0].longitude] : [11.1271, 78.6569]

  return (
    <div id="map" className="surface overflow-hidden rounded-3xl p-3">
      <MapContainer center={center} zoom={7} scrollWheelZoom className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker key={property.id} position={[property.latitude, property.longitude]} icon={markerIcon}>
            <Popup>
              <div className="min-w-[190px]">
                <strong>{property.title}</strong>
                <div>{property.price}</div>
                <div>{property.location}</div>
                <button className="mt-2 rounded-lg bg-[#0F766E] px-3 py-1.5 text-xs font-bold text-white">View Details</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
