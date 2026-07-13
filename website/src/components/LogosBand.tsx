/**
 * Supplier/client logos band (spec 00): single row on gray, above the footer.
 * Logos are uploaded via the CMS (site global).
 */
export function LogosBand({
  heading,
  logos,
}: {
  heading: string
  logos: { url: string; alt: string }[]
}) {
  if (logos.length === 0) return null
  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-ink/50">
          {heading}
        </p>
        <div className="no-scrollbar mt-6 flex items-center justify-between gap-8 overflow-x-auto">
          {logos.map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={logo.url}
              alt={logo.alt}
              className="h-10 w-auto shrink-0 opacity-70 grayscale"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
