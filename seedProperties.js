import { properties } from './src/data/properties.js'
import { supabase } from './src/services/supabaseClient.js'

async function seed() {
  const { data, error } = await supabase
    .from('property')
    .insert(
      properties.map(p => ({
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
        furnishing: p.furnishing,
        status: 'active'
      }))
    )

  console.log(data, error)
}

seed()