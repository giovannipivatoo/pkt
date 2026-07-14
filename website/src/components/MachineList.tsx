'use client'

import Link from 'next/link'
import { useState } from 'react'

export type MachineRow = {
  slug: string
  name: string
  shortDescription: string
  href: string
  image: { url: string; alt: string } | null
}

const STEP = 3

/** Category machine list: alternating rows, revealing 3 at a time via "view all". */
export function MachineList({ machines, viewAllLabel }: { machines: MachineRow[]; viewAllLabel: string }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? machines : machines.slice(0, STEP)

  return (
    <>
      <div className="space-y-16">
        {visible.map((machine, i) => {
          const flipped = i % 2 === 1
          return (
            <Link
              key={machine.slug}
              href={machine.href}
              className="group grid items-center gap-8 md:grid-cols-2"
            >
              <div className={flipped ? 'md:order-2' : ''}>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{machine.name}</h2>
                <p className="mt-4 text-ink/70">{machine.shortDescription}</p>
              </div>
              {machine.image && (
                <div className={flipped ? 'md:order-1' : ''}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={machine.image.url}
                    alt={machine.image.alt}
                    className="aspect-[4/3] w-full rounded-xl object-cover transition-transform group-hover:scale-[1.02]"
                  />
                </div>
              )}
            </Link>
          )
        })}
      </div>
      {!showAll && machines.length > STEP && (
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-full bg-ink px-8 py-3 font-semibold text-white transition-opacity hover:opacity-80"
          >
            {viewAllLabel}
          </button>
        </div>
      )}
    </>
  )
}
