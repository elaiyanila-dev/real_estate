import React from 'react'

export default function PropertyComparison({ properties }) {
  if (properties.length < 2) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-[#CBD5D1] bg-white/70 p-6 text-center text-sm text-[#6B7280]">
        Select at least two properties to compare price, area, amenities, parking, and furnishing.
      </div>
    )
  }

  const rows = [
    ['Price', (property) => property.price],
    ['Area', (property) => property.area],
    ['BHK', (property) => property.bhk ? `${property.bhk} BHK` : property.propertyType],
    ['Location', (property) => property.location],
    ['Amenities', (property) => property.amenities.join(', ')],
    ['Parking', (property) => property.parking],
    ['Furnishing', (property) => property.furnishing],
  ]

  return (
    <div className="surface mt-10 overflow-x-auto rounded-3xl p-5">
      <h3 className="mb-4 text-2xl font-extrabold text-[#1F2937]">Property Comparison</h3>
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 text-left font-bold text-[#6B7280]">Feature</th>
            {properties.map((property) => (
              <th key={property.id} className="px-4 py-3 text-left font-extrabold text-[#134E4A]">{property.title}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {rows.map(([label, getter]) => (
            <tr key={label}>
              <td className="py-3 font-bold text-[#1F2937]">{label}</td>
              {properties.map((property) => (
                <td key={property.id} className="px-4 py-3 text-[#6B7280]">{getter(property)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
