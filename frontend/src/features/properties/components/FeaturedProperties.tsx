import { useRef } from 'react'
import { Property } from '../types'
import { PropertyCard } from './PropertyCard'

interface FeaturedPropertiesProps {
  properties: Property[]
}

export const FeaturedProperties = ({ properties }: FeaturedPropertiesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('[data-featured-card]')?.clientWidth || 400
      const gap = 24 // gap-6 = 1.5rem = 24px
      scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('[data-featured-card]')?.clientWidth || 400
      const gap = 24 // gap-6 = 1.5rem = 24px
      scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' })
    }
  }

  const isSingleProperty = properties.length === 1

  return (
    <section className="mb-16 py-8 w-full">
      <h2 className="text-black text-3xl md:text-4xl font-semibold mb-8 text-center">
        Featured Properties
      </h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSingleProperty ? (
          // Single property - center it, no arrows
          <div className="flex justify-center w-full">
            <div className="w-full max-w-md">
              <PropertyCard property={properties[0]} featured />
            </div>
          </div>
        ) : (
          // Multiple properties - show with arrows
          <div className="relative w-full">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full text-gold-600 text-3xl flex items-center justify-center shadow-lg hover:bg-gold-50 hover:scale-110 transition-all z-10 active:scale-95"
            >
              ‹
            </button>
            <div
              ref={scrollRef}
              className="flex gap-6 md:gap-8 overflow-x-auto overflow-y-hidden scroll-smooth py-4 hide-scrollbar"
            >
              {properties.map((property) => (
                <div key={property.id} data-featured-card>
                  <PropertyCard property={property} featured />
                </div>
              ))}
            </div>
            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full text-gold-600 text-3xl flex items-center justify-center shadow-lg hover:bg-gold-50 hover:scale-110 transition-all z-10 active:scale-95"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProperties
