'use client'

import { useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'lg'
}

export default function Logo({ size = 'sm' }: LogoProps) {
  const [error, setError] = useState(false)
  const heightClass = size === 'lg' ? 'h-12' : 'h-8'

  if (error) {
    return (
      <span className={`${heightClass} flex items-center font-serif font-bold text-xl`}>
        <span style={{ color: 'var(--text)' }}>pedido</span>
        <span style={{ color: 'var(--accent)' }}>mobile</span>
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="pedidomobile — Laboratório Sobral"
      className={heightClass}
      onError={() => setError(true)}
    />
  )
}
