import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aster Medicines',
    short_name: 'Aster Medicines',
    description: 'Pioneering pharmaceutical manufacturing since 1951. Aster Medicines bridges the gap between scientific breakthrough and human compassion.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
