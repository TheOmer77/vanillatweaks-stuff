# Vanilla Tweaks stuff

This repo includes a REST API and a CLI app, for listing and downloading Minecraft resource packs, datapacks and crafting tweaks from [Vanilla Tweaks](https://vanillatweaks.net/).

**Vanilla Tweaks packs themselves are not hosted here.** Both the API and CLI utilize the official Vanilla Tweaks server and API, available at vanillatweaks.net.

## Usage

### API

The REST API allows listing and downloading pack files, or downloading a zip containing several packs.

By default the latest Minecraft version is used, but a `version` query parameter can be used in all routes to specify a version. For example:

```
/datapacks?version=1.20
```

For each pack type (`resoucepacks`, `datapacks`, `craftingtweaks`), the following routes are available:

#### `/{PACK_TYPE}`

List all available packs of a certain type. Packs will be listed as a flat array (ignoring categories), and each will have an `id` property, usable in other routes.

Example:

```
/datapacks
```

#### `/{PACK_TYPE}/packs/{PACK_ID}`

Download a zip file containing a single pack. `{PACK_ID}` is the ID of the pack you want to download.

Example:

```
/craftingtweaks/packs/back-to-blocks
```

#### `/{PACK_TYPE}/zip?packs={PACK_IDS}`

Download a zip file containing several packs. `{PACK_IDS}` is a comma-separated list of pack IDs you want to include in the downloaded zip file.

Note that when downloading datapacks, the downloaded zip includes several zip files for each datapack, and must be extracted manually.

Example:

```
/resourcepacks/zip?packs=bushy-leaves,fancy-sunflowers,dark-ui
```

### CLI

The CLI app allows listing and downloading packs to disk, either in a single zip file or individual files for each pack.

For each pack type (`resoucepacks`, `datapacks`, `craftingtweaks`), the following commands are available:

#### `PACK_TYPE list [OPTIONS]`

List all available packs of a certain type. By default, this will print a list of pack IDs without any additional info.

Example:

```bash
vanillatweaks resourcepacks list
```

Options:

- `--detailed` - Print list with additional details, such as descriptions and incompatible packs.
- `--version, -v` - Specify a Minecraft version. (Default: 1.20)

#### `PACK_TYPE download [OPTIONS] PACK_IDS...`

Download packs and save them to disk. By default, each pack will be saved as its own file, to the current directory.

Example:

```bash
vanillatweaks datapacks download -o ./datapacks more-mob-heads player-head-drops track-statistics track-raw-statistics
```

Options:

- `--outDir, -o` - Directory where file(s) will be downloaded.
- `--zipped, -z` - Save a single zip file containing all datapacks, instead of multiple files. When downloading datapacks, this zip file can't be used as is, and must be extracted manually.
- `--version, -v` - Specify a Minecraft version. (Default: 1.20)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 20
- [PNPM](https://pnpm.io/) as the package manager
- [Docker](https://www.docker.com/), if you want to run the API as a docker container

To install dependencies:

```bash
pnpm install
```

### Scripts

#### `pnpm start:api`

Run the **built** API server from `packages/api/dist/` on [localhost:3000](http://localhost:3000).

#### `pnpm start:cli <COMMAND> ...`

Run the CLI. Command and args are passed to the script.

#### `pnpm dev:api`

Run the API server in development mode. This means saving any code changes will restart the server.

#### `pnpm build:api`

Build the API server into a single JS file in `packages/api/dist/`.

#### `pnpm build:cli`

Build the CLI app into a single JS file, then to executable files for several platforms, in `packages/cli/dist/`.

#### `pnpm lint`

Run TypeScript type checking & ESLint linting. Scripts for individual packages are available: `lint:api`, `lint:cli`, `lint:core`.

#### `pnpm format`

Format all files using Prettier.

### Build the API as a Docker container

Run the following at the project root:

```bash
docker build -t vanillatweaks-api -f packages/api/Dockerfile .
```

## Credits

Vanilla Tweaks - [vanillatweaks.net](https://vanillatweaks.net/)
