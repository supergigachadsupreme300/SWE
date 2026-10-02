import React from 'react'

type ProductGalleryProps = {
  images: string[]
  alt: string
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const safeIndex = images.length ? Math.min(activeIndex, images.length - 1) : 0
  const activeImage = images[safeIndex]

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white">
        {activeImage ? (
          <img
            src={activeImage}
            alt={`${alt} - image ${safeIndex + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <ul className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <li key={`${image}-${index}`}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1} of ${alt}`}
                aria-current={index === safeIndex}
                className={[
                  'aspect-square w-full overflow-hidden rounded-lg border bg-white',
                  index === safeIndex ? 'border-amber-600 ring-1 ring-amber-600' : 'border-gray-200',
                ].join(' ')}
              >
                <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
