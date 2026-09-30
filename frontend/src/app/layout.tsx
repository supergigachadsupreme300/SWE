import './globals.css'
import React from 'react'

export const metadata = {
  title: 'BrewLite',
  description: 'BrewLite frontend scaffold',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-50 text-gray-900">{children}</main>
      </body>
    </html>
  )
}
