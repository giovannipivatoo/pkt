# Initial preview catalog — 2026-09-10

Source: local Astro homepage, category page and FPK24 detail. `source.json` is the
extracted content snapshot. The three category names follow the user's correction.

Import plan: upload the existing image files, create the three categories, then
create FPK 24/42/44 referencing Confezionatrice verticale. Retain `confezionatrici`
and `fpk-24`; assign `fpk-42`/`fpk-44` to the other machines. The horizontal category
and Presse remain separate. Only machine model and slug differ; other content is
intentionally FPK24 demo data. Category page copy, gallery and rich text map to
fixed schema fields. Locale entries preserve the source wording; no translations.

The script creates published CMS documents using generated IDs and asset uploads.
An existing slug is kept unchanged; ambiguous matches/drafts stop the import.
Default execution only prints the plan. See the Studio README for commands.

Verified after import:

- 3 categories and 3 machines.
- All machines reference the vertical category.
- Machine content matches exactly after excluding model, slug and system fields.
- 6 specification rows and 3 gallery items per machine.
- 5 distinct referenced Sanity image assets (identical source files deduplicate).
- `sanity documents validate --yes --format json` returned `[]`: no issues.
- TypeScript, schema validation, localization checks, ESLint and schema extraction
  passed; TypeGen generated 25 schema types in the ignored `.sanity/` directory.

No website cutover: Astro still uses the local preview. No existing URL changed,
so this import requires no redirect changes. Migration from the old pkt.it and
the eventual production redirect map remain separate work. Replace the FPK42/44
demo specifications with approved data before production launch.
