# AGENTS.md — img-fit

## Project overview

`img-fit` is a zero-dependency vanilla JavaScript npm package. It is a client-side companion for [img-fwd](https://img-fwd.driedel.dev/) that measures rendered container widths and appends the optimal `?rs=<width>` query string.

## Conventions

- **Language**: all code, comments, variables, and documentation are written in English.
- **Dependencies**: do not add runtime dependencies. The library must stay vanilla JS.
- **Module format**: dual CJS / ESM.
  - ESM source lives in `src/*.js`.
  - `src/index.mjs` re-exports the ESM API.
  - `src/index.cjs` is a hand-maintained CommonJS build of the same logic.
  - `package.json` uses `"type": "module"`.
- **Tests**: small Node assert-based tests in `test/img-fit.test.js`. Run with `npm test`.
- **Example**: a static browser example lives in `examples/vanilla/`. It is served with any static file server.

## File responsibilities

| File | Purpose |
|---|---|
| `src/snap.js` | Width snapping and DPR utilities. |
| `src/url.js` | URL building with `URLSearchParams`. |
| `src/img-fit.js` | Core `ImgFit` class and default singleton. |
| `src/index.mjs` | ESM entry point. |
| `src/index.cjs` | CommonJS entry point (mirror of the ESM logic). |

## Convenção de commits

`type(scope): description` (ex.: `feat(cursos): adiciona filtro por idioma`,
`fix(i18n): corrige fallback de page_content para zh-CN`, `chore(deps): atualiza
pgx para v5.7.2`). Tipos comuns: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`.

## When modifying code

- If you change `src/img-fit.js`, `src/snap.js`, or `src/url.js`, update `src/index.cjs` to match so both module formats stay in sync.
- Keep the public API stable: `ImgFit.init()`, `ImgFit.watch()`, `ImgFit.unwatch()`, `ImgFit.getOptimalWidth()`, `ImgFit.buildUrl()`.
- Do not change the default breakpoint grid without updating `README.md` and the example page.
- Add or update tests for any new pure utility function.

## Known limitations

- `src/index.cjs` duplicates the ESM logic manually. There is no build step in v1.
- Framework wrappers (React, Next, Angular) are intentionally out of scope for v1.
- The example page must be served over HTTP(S) because it uses ES modules.
