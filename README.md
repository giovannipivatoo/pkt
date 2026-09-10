# PKT

- **Website preview:** https://giovannipivatoo.github.io/pkt/it/
- **Sanity Studio:** https://pkt-cms.sanity.studio/

Log in to Studio with the PKT Sanity account, edit categories or machines, and
click **Pubblica**. GitHub Pages rebuilds approximately every ten minutes (GitHub
may delay scheduled jobs). Drafts stay off the site. A manual **Deploy website
preview** workflow run also refreshes it.

Catalog pages, machine details, home category cards and category navigation use
Sanity. Other fixed-page content remains in code pending its schemas.

## Local development

```sh
# Public Astro website
npm --prefix web install
npm --prefix web run dev

# Sanity editor
npm --prefix studio install
npm --prefix studio run dev
```

See [web/README.md](web/README.md), [studio/README.md](studio/README.md) and
[context/todo.md](context/todo.md) for checks and remaining production launch work.
