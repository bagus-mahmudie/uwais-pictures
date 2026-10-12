# Uwais Pictures

Uwais Pictures production company website featuring a film catalog, news, and pages in Indonesian and English.

**Status:** Live · [Visit website](https://uwaispictures.id/)

## Features

- Film catalog and production detail pages
- News and company information
- Contact form through a PHP endpoint

## Technology

Eleventy 3, Nunjucks, Tailwind CSS 3, PHP / PHPMailer.

## Running Locally

Install Node.js and npm versions that meet the dependency requirements in `package-lock.json`.

```sh
npm ci
npm run dev
```

Open the server address shown in the terminal. To build the site:

```sh
npm run build
```

Build output is written to `_site/`. The build output directory is not the repository's primary source.

## Structure

- `src/` — pages, templates, data, and assets.
- `.eleventy.js` — site generator configuration.
- `package.json` — dependencies and development commands.

## Contact Form

The `src/api/contact.php` endpoint requires a PHP server. Set the `MAIL_USERNAME` and `MAIL_PASSWORD` server environment variables for SMTP. The Eleventy preview server only serves static pages; email delivery must be tested on a PHP server.

## Repository Notes

Installed dependencies, caches, `.env` files, databases, and user uploads are not included. Brand names and third-party assets remain subject to their respective owners' rights. This repository does not grant a license for reuse.
