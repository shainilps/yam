# **Yam**

Yam is a CLI tool built to automate the boring setup tasks of a typical Node.js project. If you're anything like me — tired and lazy before you even start writing code — you know the pain. You spend more time installing libraries, configuring tools, and managing dependencies than actually building something.

With Yam, you can skip all that repetitive setup. No more juggling a dozen configs just to get started. Yam sets up things like TypeScript, ESLint, Prettier, Husky, and more — all with just a few commands.

Built by a lazy developer, for lazy developers. Yam saves you time, energy, and sanity. It saved me — maybe it'll save you too.


## Quick Start
```bash
npm install -g @codeshaine/yam
npm install -D @codeshaine/yam
```

## Commands
```bash
yam init
yam setup <components> --option value
```
**Options**:
- `-t , --typescript` : Enable TS (`y`/`n`, default: `y`)
- `-p , --package-manager` : npm/yarn/pnpm/bun (default: pnpm)


## Supported Components
- typescript
- eslint
- prettier
- vitest
- husky (husky + lint-staged)
- workflows (Github Actions workflows)
- git

## Example
```bash
yam init
yam setup eslint --typescript y --package-manager pnpm
yam setup eslint -t y -p pnpm                          #alternative
```
