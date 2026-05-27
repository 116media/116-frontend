# 116-frontend

116 (Cent-Seize) is a bold digital platform that promotes music and hip-hop culture in DR and beyond. Through articles, video shows, and exclusive behind-the-scenes content, it connects fans with artists, highlights emerging talent, and tells the stories shaping the culture.

This is the public-facing website built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- IDE: [Visual Studio Code](https://code.visualstudio.com/)

### Quick Setup

```bash
# Install dependencies
yarn install

# Start the dev server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
| --------- | ------------- |
| `yarn dev` | Start the development server |
| `yarn build` | Build for production |
| `yarn start` | Start the production server |
| `yarn lint:code` | Lint code with Biome |
| `yarn lint:code:fix` | Lint and auto-fix with Biome |
| `yarn lint:types` | Type-check with TypeScript |
| `yarn api:generate` | Regenerate API types from Swagger |

## Development Workflow

1. Create a feature branch following the [naming conventions](#branch-naming)
2. Make your changes, code will be auto-formatted on save
3. Commit changes following [conventional commit](https://www.conventionalcommits.org/) format
4. Push to remote and create a pull request

## Code Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

### Biome Configuration

Biome handles formatting and general linting with these settings:

- Indentation: 4 spaces
- Line endings: LF
- Line width: 100 characters
- Double quotes
- Semicolons always
- No trailing commas
- Auto organize imports on save

### VS Code Setup

The project includes `.vscode/settings.json` with auto-format on save enabled. Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for the best experience.

### Manual Commands

```bash
# Format all files
yarn lint:code:fix

# Type-check without emitting
yarn lint:types
```

## Code Style Standards

The project enforces:

- Indentation: 4 spaces
- Line endings: LF (Unix-style)
- Encoding: UTF-8
- Trailing whitespace: Automatically trimmed
- Final newline: Automatically added
- Import organization: Automatic via Biome

## Git Workflow

This project follows the same branching strategy as the rest of the 116 platform. See the [backend README](../backend/README.md) for the full workflow documentation.

### Branch Naming

Pattern: `^(feat|chore|bug|fix|doc|docs|style|refactor|perf|test|build|ci|revert)-[a-z]+(-[a-z]+)*$`

Examples:

- `feat-home-page`
- `fix-seo-metadata`
- `chore-update-dependencies`

## Tech Stack

| Category | Technology |
| ---------- | ------------ |
| Framework | Next.js 16 |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Linting | Biome |
| Package Manager | Yarn |
