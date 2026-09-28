# studjisocjali.mt

Marketing site for StudjiSoċjali.mt — private Social Studies & Sociology tuition in Malta.

A static, dependency-free site (Maltese / English) in `site/`:

- `site/index.html` — the landing page (styles and script inline)
- `site/privacy.html` — privacy notice
- `site/favicon.svg`

Deployed to Azure Static Web Apps by `.github/workflows/` on every push to `master`.
To preview locally, open `site/index.html` or run `npx serve site`.

Enquiries are emailed via FormSubmit (`FORM_ENDPOINT` near the bottom of `index.html`).
The first submission sends an activation email to barbarakylie@outlook.com that must be confirmed once.
