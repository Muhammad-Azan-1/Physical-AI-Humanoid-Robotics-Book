# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

## Troubleshooting Initialization

### Network Issues

### Existing Directory Conflict

If Docusaurus initialization fails with a "Directory already exists" error, it means the `physical-ai-book` directory is not empty. To resolve this, you can either:

1.  **Delete the existing directory**: `rm -rf physical-ai-book` (use with caution as this will permanently delete all contents).
2.  **Initialize in a different directory**: Choose a new, empty directory name for the project.

After resolving the conflict, you can re-run the initialization command:

```bash
npx create-docusaurus@latest physical-ai-book classic --typescript
```

If Docusaurus initialization fails due to network issues (e.g., during package installation), try re-running the command:

```bash
npx create-docusaurus@latest physical-ai-book classic --typescript
```

Ensure you have a stable internet connection. If issues persist, clear npm cache (`npm cache clean --force`) and try again.

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
