import './globals.css'
import React from 'react'

import {
  CartBadge,
  CartProvider,
} from '../features/cart'

export const metadata = {
  title: 'BrewLite',
  description: 'BrewLite frontend scaffold',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <CartBadge />

          <main className="min-h-screen bg-gray-50 text-gray-900">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
