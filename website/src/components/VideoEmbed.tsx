/** Wide video embed with native player controls (play button). */
export function VideoEmbed({ url, title }: { url: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-ink">
      <iframe
        src={url}
        title={title}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
