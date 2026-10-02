import type { ProductDetail, RelatedProduct } from '../types'

const MOCK_PRODUCTS: ProductDetail[] = [
  {
    id: 'mock-cappuccino',
    name: 'Cappuccino',
    description:
      'Double espresso steamed with silky milk and a thin layer of foam. BrewLite signature blend, roasted weekly.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=1200&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80',
    ],
    stock: 24,
    category: 'Espresso',
    brand: 'BrewLite',
    createdAt: '2026-01-12T02:00:00.000Z',
  },
  {
    id: 'mock-matcha-latte',
    name: 'Matcha Latte',
    description: 'Ceremonial grade matcha whisked with steamed milk and a touch of vanilla syrup.',
    price: 55000,
    images: ['https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=1200&q=80'],
    stock: 6,
    category: 'Tea',
    brand: 'BrewLite',
    createdAt: '2026-01-18T02:00:00.000Z',
  },
  {
    id: 'mock-cold-brew',
    name: 'Cold Brew',
    description: 'Slow steeped for 18 hours, served over ice with an optional splash of tonic.',
    price: 49000,
    images: ['https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&q=80'],
    stock: 0,
    category: 'Cold',
    brand: 'BrewLite',
    createdAt: '2026-02-02T02:00:00.000Z',
  },
  {
    id: 'mock-viet-pho-coffee',
    name: 'Vietnamese Phin Coffee',
    description: 'Robusta brewed through a traditional metal phin, condensed milk on the side.',
    price: 32000,
    images: ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80'],
    stock: 15,
    category: 'Espresso',
    brand: 'BrewLite',
    createdAt: '2026-02-11T02:00:00.000Z',
  },
  {
    id: 'mock-mocha',
    name: 'Dark Chocolate Mocha',
    description: '70% cacao, espresso and steamed milk finished with whipped cream.',
    price: 59000,
    images: ['https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=1200&q=80'],
    stock: 3,
    category: 'Espresso',
    brand: 'BrewLite',
    createdAt: '2026-02-20T02:00:00.000Z',
  },
]

export function isMockEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PRODUCT_DETAIL_MOCK !== 'false'
}

function findMockProduct(id: string): ProductDetail | undefined {
  return MOCK_PRODUCTS.find((product) => product.id === id)
}

export function getMockProduct(id: string): ProductDetail | null {
  const product = findMockProduct(id) ?? MOCK_PRODUCTS[0]
  return product ? { ...product, images: [...product.images] } : null
}

export function getMockRelatedProducts(id: string, limit: number): RelatedProduct[] {
  return MOCK_PRODUCTS.filter((product) => product.id !== id)
    .slice(0, Math.max(0, limit))
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] ?? null,
    }))
}

export function getMockProductIds(): string[] {
  return MOCK_PRODUCTS.map((product) => product.id)
}
