'use client'

import type { ReactNode } from 'react'
import { useRef, useState } from 'react'

type Props = {
  children: ReactNode[]
  /** Width classes for each slide, e.g. "w-[85%] md:w-[31.5%]" */
  itemClassName: string
  /** 'header' puts prev/next at the top-right; 'sides' overlays them on the edges */
  arrows?: 'header' | 'sides'
  /** Optional header content rendered left of the top-right arrows */
  header?: ReactNode
  showDots?: boolean
}

function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      className="flex size-10 items-center justify-center rounded-full border border-ink/20 bg-white transition-colors hover:bg-ink hover:text-white"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <path
          d={dir === 'prev' ? 'M9 2L4 7l5 5' : 'M5 2l5 5-5 5'}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </button>
  )
}

export function Carousel({ children, itemClassName, arrows = 'sides', header, showDots }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count = children.length

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const slide = el.firstElementChild as HTMLElement | null
    el.scrollBy({ left: dir * (slide ? slide.offsetWidth + 24 : el.clientWidth), behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const slide = el.firstElementChild as HTMLElement | null
    if (!slide) return
    setIndex(Math.min(count - 1, Math.round(el.scrollLeft / (slide.offsetWidth + 24))))
  }

  return (
    <div>
      {(arrows === 'header' || header) && (
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>{header}</div>
          {arrows === 'header' && (
            <div className="flex shrink-0 gap-2">
              <Arrow dir="prev" onClick={() => scrollBy(-1)} />
              <Arrow dir="next" onClick={() => scrollBy(1)} />
            </div>
          )}
        </div>
      )}
      <div className="relative">
        <div
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth"
        >
          {children.map((child, i) => (
            <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
              {child}
            </div>
          ))}
        </div>
        {arrows === 'sides' && count > 1 && (
          <>
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 sm:-left-5">
              <Arrow dir="prev" onClick={() => scrollBy(-1)} />
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 sm:-right-5">
              <Arrow dir="next" onClick={() => scrollBy(1)} />
            </div>
          </>
        )}
      </div>
      {showDots && count > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {children.map((_, i) => (
            <span
              key={i}
              className={`size-2 rounded-full ${i === index ? 'bg-ink' : 'bg-ink/20'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
