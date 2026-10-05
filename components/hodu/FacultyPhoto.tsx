'use client'

import { useState } from 'react'
import { normalizeImageUrl } from '@/lib/imageUtils'

interface FacultyPhotoProps {
  src?: string | null
  name: string
  className?: string
  fallbackClassName?: string
}

// Tries the direct URL first, then the server-side image proxy (bypasses hotlink
// protection on the old hoduacademy.com Moodle uploads), then falls back to initials.
export default function FacultyPhoto({ src, name, className = '', fallbackClassName = '' }: FacultyPhotoProps) {
  const direct = normalizeImageUrl(src)
  const [stage, setStage] = useState(0)

  const proxied = direct.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(direct)}` : ''
  const current = stage === 0 ? direct : stage === 1 ? proxied : ''

  if (!current) {
    return (
      <div className={`w-full h-full flex items-center justify-center font-bold text-brand-maroon bg-brand-maroon/10 ${fallbackClassName}`}>
        {name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, '').slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      key={current}
      src={current}
      alt={name}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setStage(s => (s === 0 && proxied ? 1 : 2))}
    />
  )
}
