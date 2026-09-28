# studjisocjali.mt

Marketing site for StudjiSoċjali.mt — private Social Studies & Sociology tuition in Malta.

A static, dependency-free site (Maltese / English) in `site/`:

| Path | What it is |
| --- | --- |
| `site/index.html` | Landing page markup |
| `site/privacy.html` | Privacy notice (both languages, plain HTML) |
| `site/css/styles.css` | All styles, shared by both pages |
| `site/js/main.js` | Language switching, subject tabs, mobile menu, animations, enquiry form |
| `site/i18n/mt.json`, `site/i18n/en.json` | All landing page text, one file per language |
| `site/staticwebapp.config.json` | Azure Static Web Apps headers and 404 handling |
| `site/robots.txt`, `site/sitemap.xml`, `site/favicon.svg` | Search engine files and icon |
| `site/og-image.png` | 1200×630 link-preview image (Facebook, WhatsApp, etc.), made from the Facebook cover design |

## Editing text

Change the landing page text in `site/i18n/mt.json` (Maltese) or `site/i18n/en.json` (English):

- `title` is the browser tab title.
- `strings` holds every label, heading and message. The key matches the `data-i18n` attribute on the element in `index.html`; change only the text, never the key.
- `subjects` holds the three level tabs (`o` = O-Level, `i` = Intermediate, `a` = A-Level): kicker, title, short description and topic list.

Both files must stay valid JSON: text goes in double quotes, a `"` inside text must be written `\"`, and entries are separated by commas.
The Maltese text inside `index.html` is only what shows before the JSON loads; edits there are overwritten.

## Running locally

The page loads its text with `fetch`, so it must be served over HTTP (opening `index.html` straight from disk will not load the text):

```sh
npx serve site
```

## Deploying

Pushing to `master` deploys to the Azure Static Web App **stapp-studjisocjalimt** (resource group `rg-studjisocjalimt`) through `.github/workflows/`.
The workflow reads the app's deployment token from the `AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_OCEAN_00C455303` repository secret.

## Enquiry form

Enquiries are emailed via Formspree to the address that owns the Formspree form.
The form's ID is set in `FORMSPREE_FORM_ID` at the top of `site/js/main.js`; while it is empty the form shows its "couldn't send" message.
FormSubmit was dropped because GO's Secure Net filter blocks formsubmit.co.
