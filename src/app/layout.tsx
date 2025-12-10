import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Email Service',
  description: 'Email service for portfolio contact form',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}