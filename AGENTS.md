# AGENTS.md — img-fit

## Project overview

`img-fit` is a zero-dependency vanilla JavaScript npm package. It is a client-side companion for [img-fwd](https://img-fwd.driedel.dev/) that measures rendered container widths and appends the optimal `?rs=<width>` query string.

This repository is a monorepo. The vanilla core lives in `packages/img-fit`, and framework adapters live in `packages/<framework>`.

## Conventions

- **Language**: all code, comments, variables, and documentation are written in English.
- **Dependencies**: the vanilla core has zero runtime dependencies. Adapters depend on `img-fit` and declare their framework as a peer dependency.
- **Module format**: dual CJS / ESM for the core; adapters ship ESM-first.
- **Tests**: small Node assert-based tests in `packages/img-fit/test/img-fit.test.js`. Run with `npm test` from the root.
- **Examples**: static browser examples live in `examples/<framework>/`.

## File responsibilities

| File / Package | Purpose |
|---|---|
| `packages/img-fit/src/snap.js` | Width snapping and DPR utilities. |
| `packages/img-fit/src/url.js` | URL building with `URLSearchParams`. |
| `packages/img-fit/src/img-fit.js` | Core `ImgFit` class and default singleton. |
| `packages/img-fit/src/index.mjs` | ESM entry point. |
| `packages/img-fit/src/index.cjs` | CommonJS entry point (mirror of the ESM logic). |
| `packages/react` | React component adapter. |
| `packages/next` | Next.js `Image` wrapper. |
| `packages/angular` | Angular directive (compiled with `tsc`). |
| `packages/vue` | Vue component adapter. |

## Convenção de commits

`type(scope): description` (ex.: `feat(cursos): adiciona filtro por idioma`,
`fix(i18n): corrige fallback de page_content para zh-CN`, `chore(deps): atualiza
pgx para v5.7.2`). Tipos comuns: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`.

## When modifying code

- If you change `packages/img-fit/src/img-fit.js`, `packages/img-fit/src/snap.js`, or `packages/img-fit/src/url.js`, update `packages/img-fit/src/index.cjs` to match so both module formats stay in sync.
- Keep the public API stable: `ImgFit.init()`, `ImgFit.watch()`, `ImgFit.unwatch()`, `ImgFit.getOptimalWidth()`, `ImgFit.buildUrl()`.
- Do not change the default breakpoint grid without updating the READMEs and the example page.
- Add or update tests for any new pure utility function in the core.
- If you add or change an adapter, update its README and the root README table.

## Known limitations

- `packages/img-fit/src/index.cjs` duplicates the ESM logic manually. There is no build step for the core.
- The Angular adapter requires `tsc` and is the only adapter with a build step.
- The Next.js adapter uses `next/image` with the `fill` prop; the parent element must have explicit dimensions.
