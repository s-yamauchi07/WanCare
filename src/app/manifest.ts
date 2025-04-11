import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WanCare',
    short_name: 'WanCare',
    description: '愛犬の「いつも」を記録し、「もしも」に備える',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5ebda',
    theme_color: '#f5ebda',
    icons: [
      {
        "src": "/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
  }
}