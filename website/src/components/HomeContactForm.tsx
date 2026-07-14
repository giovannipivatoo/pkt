'use client'

import { useState } from 'react'

type Strings = {
  areaLabel: string
  areaOther: string
  nameLabel: string
  emailLabel: string
  descriptionLabel: string
  sendLabel: string
  success: string
}

/**
 * Home contact section form (spec 01 §5): area of interest over the
 * categories + "other", name, email, optional description.
 * Submission stubbed — deferred, see spec 00.
 */
export function HomeContactForm({
  strings,
  categories,
}: {
  strings: Strings
  categories: { name: string; slug: string }[]
}) {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return <p className="rounded-lg bg-white p-6 font-medium">{strings.success}</p>
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        // Stub: submission wiring deferred (spec 00).
        setSubmitted(true)
      }}
    >
      <label className="grid gap-1 text-sm font-medium">
        {strings.areaLabel}
        <select name="area" className="rounded-md border border-ink/20 bg-white px-3 py-2.5">
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
          <option value="other">{strings.areaOther}</option>
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          {strings.nameLabel}
          <input type="text" name="name" required className="rounded-md border border-ink/20 bg-white px-3 py-2.5" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {strings.emailLabel}
          <input type="email" name="email" required className="rounded-md border border-ink/20 bg-white px-3 py-2.5" />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        {strings.descriptionLabel}
        <textarea name="description" rows={4} className="rounded-md border border-ink/20 bg-white px-3 py-2.5" />
      </label>
      <button
        type="submit"
        className="mt-1 w-fit rounded-full bg-ink px-8 py-3 font-semibold text-white transition-opacity hover:opacity-80"
      >
        {strings.sendLabel}
      </button>
    </form>
  )
}
