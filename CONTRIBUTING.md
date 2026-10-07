# Contributing

Thanks for your interest in contributing!

## Development setup

```sh
git clone https://github.com/grepguard/cloudmind-cli.git
cd cloudmind-cli
npm install
```

This package requires Node.js 24.13.0 or later.

## Link the CLI locally

To use the working copy as a global `cloudmind` command:

```sh
npm link
```

To remove the global link:

```sh
npm unlink -g cloudmind
```

## Checks

- `npm run check:ci` runs Biome checks without modifying files.
- `npm run check` runs Biome checks and applies safe fixes and formatting changes.

## Releasing (maintainers only)

Publishing is done manually by maintainers.

1. Bump the package version. This updates `package.json`, `package-lock.json`, and creates a commit and tag:

   ```sh
   npm version patch
   ```

2. Push the commit and tag. The tag triggers the GitHub Release workflow:

   ```sh
   git push origin main --follow-tags
   ```

3. Log in to npm if needed, then publish:

   ```sh
   npm login
   npm publish
   ```

GitHub Actions will automatically create a GitHub Release from the tag.
