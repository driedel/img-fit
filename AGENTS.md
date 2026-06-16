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

## Release checklist

Follow every step in order before creating a git tag. A tag triggers the GitHub Actions publish pipeline — if any step is skipped, the CI will fail and a wasted patch version will be burned.

### 1. Bump versions

Bump the `version` field in **all six** `package.json` files to the same value:

```
package.json                        (monorepo root)
packages/img-fit/package.json
packages/react/package.json
packages/next/package.json
packages/vue/package.json
packages/angular/package.json
```

### 2. Update the lock file

After changing any package name or version, always regenerate the lock file:

```bash
npm install
```

Commit the updated `package-lock.json` together with the version bumps. If the lock file is not in sync, `npm ci` will fail in CI.

### 3. Run tests locally

```bash
npm test
```

All packages must pass before creating a tag. Fix any failures first.

### 4. Commit

```bash
git add -A
git commit -m "chore: bump versions to X.Y.Z"
git push origin main
```

### 5. Create and push the tag

```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z - <short description>"
git push origin vX.Y.Z
```

The tag push triggers `.github/workflows/publish.yml`, which runs tests, builds the Angular adapter, and publishes all five packages to npm.

### 6. Monitor CI

Check https://github.com/driedel/img-fit/actions to confirm the workflow succeeds.

---

## Package names on npm

All packages live under the `@danilo.riedel` scope (matches the npm account username). The `@img-fit` scope and the unscoped `img-fit` name are **not available**.

| Workspace path | npm package name |
|---|---|
| `packages/img-fit` | `@danilo.riedel/img-fit` |
| `packages/react` | `@danilo.riedel/img-fit-react` |
| `packages/next` | `@danilo.riedel/img-fit-next` |
| `packages/vue` | `@danilo.riedel/img-fit-vue` |
| `packages/angular` | `@danilo.riedel/img-fit-angular` |

If you add a new adapter, use the same `@danilo.riedel/img-fit-<framework>` pattern and add a publish step to `.github/workflows/publish.yml`.

Every adapter `package.json` must have a `repository` field pointing to the monorepo root with the correct `directory`. Without it, npm provenance validation will reject the publish with `E422`. Example:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/driedel/img-fit.git",
  "directory": "packages/<framework>"
}
```

---

## Known limitations

- `packages/img-fit/src/index.cjs` duplicates the ESM logic manually. There is no build step for the core.
- The Angular adapter requires `tsc` and is the only adapter with a build step.
- The Next.js adapter uses `next/image` with the `fill` prop; the parent element must have explicit dimensions.
