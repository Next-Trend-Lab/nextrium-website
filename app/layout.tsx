import type { Metadata } from 'next'
import { Exo_2, DM_Sans, Space_Mono } from 'next/font/google'
import './globals.css'

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
  variable: '--font-exo2',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'NexTrium Global Innovations Ltd',
  description:
    'Building, scaling, and supporting digital products, startups, and talent across software development, AI, Web3, and emerging technologies.',
  openGraph: {
    title: 'NexTrium Global Innovations Ltd',
    description: 'Innovation. Incubation. Impact.',
    url: 'https://nextrium.org',
    siteName: 'NexTrium',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexTrium Global Innovations Ltd',
    description: 'Innovation. Incubation. Impact.',
    images: ['/android-chrome-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${exo2.variable} ${dmSans.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}

