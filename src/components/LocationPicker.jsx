import { useCallback, useState } from 'react'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'

const DEFAULT_CENTER = { lat: 11.0168, lng: 76.9558 } // Coimbatore, Tamil Nadu as a default fallback

export default function LocationPicker({ latitude, longitude, onChange }) {
  const [position, setPosition] = useState(
    latitude && longitude ? { lat: Number(latitude), lng: Number(longitude) } : null
  )

  const handleClick = useCallback(
    (event) => {
      const lat = event.detail.latLng?.lat
      const lng = event.detail.latLng?.lng
      if (lat == null || lng == null) return
      setPosition({ lat, lng })
      onChange?.({ latitude: lat, longitude: lng })
    },
    [onChange],
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB]">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          style={{ width: '100%', height: '320px' }}
          defaultCenter={position || DEFAULT_CENTER}
          defaultZoom={position ? 14 : 11}
          mapId="alayaa-location-picker"
          onClick={handleClick}
        >
          {position ? <AdvancedMarker position={position} /> : null}
        </Map>
      </APIProvider>
      <div className="flex items-center justify-between bg-[#F8F8F7] px-4 py-2 text-xs text-[#6B7280]">
        {position
          ? `Selected: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
          : 'Click on the map to drop a pin'}
      </div>
    </div>
  )
}