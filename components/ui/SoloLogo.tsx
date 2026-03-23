'use client'

import Image from 'next/image'

interface SoloLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'reversed'
  showTagline?: boolean
  className?: string
}

/**
 * Each tier defines:
 *   markPx   – the exact pixel dimension the mark renders at (width === height)
 *   wordmark – responsive font-size classes for the stacked SOLO· / COM text
 *   tagline  – responsive font-size classes for "NUMBER 1 GADGET HUB"
 *   rowGap   – gap between the mark and the wordmark
 *   stackGap – gap between top row and the tagline below
 */
const sizeConfig = {
  sm: {
    markPx: 28,
    wordmark: 'text-[1.1rem]',
    tagline: 'text-[0.42rem]',
    rowGap: 'gap-1.5',
    stackGap: 'gap-1',
  },
  md: {
    markPx: 34,
    wordmark: 'text-[1.35rem] sm:text-[1.5rem]',
    tagline: 'text-[0.48rem] sm:text-[0.55rem]',
    rowGap: 'gap-2',
    stackGap: 'gap-1',
  },
  lg: {
    markPx: 44,
    wordmark: 'text-[1.65rem] sm:text-[1.85rem]',
    tagline: 'text-[0.55rem] sm:text-[0.65rem]',
    rowGap: 'gap-2.5',
    stackGap: 'gap-1.5',
  },
  xl: {
    markPx: 54,
    wordmark: 'text-[2rem] sm:text-[2.25rem] lg:text-[2.6rem]',
    tagline: 'text-[0.6rem] sm:text-[0.7rem] lg:text-[0.78rem]',
    rowGap: 'gap-3',
    stackGap: 'gap-2',
  },
} as const

export function SoloLogo({
  size = 'md',
  variant = 'default',
  showTagline = true,
  className = '',
}: SoloLogoProps) {
  const config = sizeConfig[size] || sizeConfig.md
  const textColor = variant === 'reversed' ? '#FFFFFF' : '#102B46'
  const taglineColor = variant === 'reversed' ? '#FFFFFF' : '#153B63'

  return (
    <div
      className={`inline-flex flex-col items-center ${config.stackGap} ${className}`.trim()}
    >
      {/* Mark + Wordmark row */}
      <div className={`inline-flex items-center ${config.rowGap}`}>
        <Image
          src="/solo-mark.svg"
          alt="Solo.com mark"
          width={config.markPx}
          height={config.markPx}
          className="shrink-0"
          style={{ width: config.markPx, height: config.markPx }}
          priority={size === 'lg' || size === 'xl'}
        />

        <div className="flex flex-col leading-[0.82]">
          <span
            className={`${config.wordmark} font-black tracking-[-0.09em] uppercase`}
            style={{ color: textColor, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            SOLO&middot;
          </span>
          <span
            className={`${config.wordmark} font-black tracking-[-0.09em] uppercase`}
            style={{ color: textColor, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            COM
          </span>
        </div>
      </div>

      {/* Tagline */}
      {showTagline && (
        <span
          className={`${config.tagline} text-center font-extrabold uppercase tracking-[0.08em]`}
          style={{ color: taglineColor, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          NUMBER 1 GADGET HUB
        </span>
      )}
    </div>
  )
}
