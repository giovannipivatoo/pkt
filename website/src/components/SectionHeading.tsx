type Props = {
  eyebrow?: string
  heading: string
  align?: 'left' | 'center'
}

/** Section rhythm from spec 00: small eyebrow label above a large heading. */
export function SectionHeading({ eyebrow, heading, align = 'center' }: Props) {
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{heading}</h2>
    </div>
  )
}
