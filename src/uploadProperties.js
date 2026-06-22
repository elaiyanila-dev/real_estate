import { supabase } from './services/supabaseClient'
import { properties } from './data/properties.js'

export const uploadProperties = async () => {
  const formattedData = properties.map((p) => ({
    id: p.id,
    title: p.title,
    city: p.city,
    locality: p.locality,
    location: p.location,
    price: p.price,
    price_value: p.priceValue,
    bhk: p.bhk,
    area: p.area,
    area_value: p.areaValue,
    property_type: p.propertyType,
    listing_type: p.listingType,
    image: p.image,
    latitude: p.latitude,
    longitude: p.longitude,
    verified: p.verified,
    amenities: p.amenities,
    parking: p.parking,
    furnishing: p.furnishing
  }))

  const { error } = await supabase
    .from('properties')
    .insert(formattedData)

  if (error) {
    console.log(error)
    alert('Upload Failed')
  } else {
    alert('Properties Uploaded Successfully')
  }
}