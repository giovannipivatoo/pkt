const URN_RE = /urn:li:(?:share|activity|ugcPost):\d+/

/**
 * Normalize whatever an editor pastes — the full <iframe> embed code, a post
 * URL, an embed URL, or a bare URN — into the canonical embed src. Falls back
 * to the trimmed input if no URN is found.
 */
export const linkedinEmbedUrl = (input: string): string => {
  const urn = input.match(URN_RE)?.[0]
  return urn ? `https://www.linkedin.com/embed/feed/update/${urn}` : input.trim()
}
