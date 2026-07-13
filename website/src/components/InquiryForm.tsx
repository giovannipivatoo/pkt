'use client'

import { useState } from 'react'

export type InquiryStrings = {
  title: string
  subtitle: string
  nameLabel: string
  contactLabel: string
  requestLabel: string
  termsLabel: string
  submitLabel: string
  success: string
}

/**
 * "Richiedi informazioni macchinario" shared block (spec 00).
 * Submission is intentionally stubbed — client decision, deferred. Wire to
 * email or an inquiries collection before launch. On product pages the
 * request is tagged with the machine name.
 */
export function InquiryForm({ strings, machineName }: { strings: InquiryStrings; machineName?: string }) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight">{strings.title}</h2>
        <p className="mt-2 text-ink/60">{strings.subtitle}</p>
      </div>
      {submitted ? (
        <p className="mt-10 rounded-lg bg-mist p-6 text-center font-medium">{strings.success}</p>
      ) : (
        <form
          className="mt-10 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            // Stub: submission wiring deferred (spec 00). Tag: machineName.
            setSubmitted(true)
          }}
        >
          {machineName && <input type="hidden" name="machine" value={machineName} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              {strings.nameLabel}
              <input
                type="text"
                name="name"
                required
                className="rounded-md border border-ink/20 px-3 py-2.5"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {strings.contactLabel}
              <input
                type="text"
                name="contact"
                required
                className="rounded-md border border-ink/20 px-3 py-2.5"
              />
            </label>
          </div>
          <label className="grid gap-1 text-sm font-medium">
            {strings.requestLabel}
            <textarea
              name="request"
              required
              rows={5}
              defaultValue={machineName ? `${machineName}: ` : undefined}
              className="rounded-md border border-ink/20 px-3 py-2.5"
            />
          </label>
          <label className="flex items-start gap-2 text-sm text-ink/70">
            <input type="checkbox" name="terms" required className="mt-1" />
            {strings.termsLabel}
          </label>
          <button
            type="submit"
            className="mx-auto mt-2 rounded-full bg-ink px-8 py-3 font-semibold text-white transition-opacity hover:opacity-80"
          >
            {strings.submitLabel}
          </button>
        </form>
      )}
    </section>
  )
}
