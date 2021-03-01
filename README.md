# Ísland.is

This [GitHub organization](https://github.com/island-is) is the center of development for digital government services on `island.is`. It is managed by the [Digital Iceland](https://stafraent.island.is/) department inside the [Ministry of Finance and Economic Affairs](https://www.government.is/ministries/ministry-of-finance-and-economic-affairs/).

These solutions are [FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software) and open to contributions, but most development will be performed by teams that win tenders to develop new functionality for Digital Iceland.

The repository is a [monorepo](../technical-overview/monorepo.md) that has multiple apps (something that can be built and run) and libraries (which other apps and libraries can depend on). All custom-written services is stored in there.

## GitBook

The apps and libraries documentation and our handbook are hosted on [GitBook](https://www.gitbook.com).

### For a better reading experience make sure to visit [docs.devland.is](https://docs.devland.is/handbook/).

## Storybook

The Ísland.is design system is developed and showcased using [Storybook](https://storybook.js.org) and is publicly available at [ui.devland.is](https://ui.devland.is).

## Reading material

To get more technical information about the project please make sure to read this [overview](handbook/technical-overview/README.md).

## How to contribute

If you want to contribute to the repository, please make sure to follow [this guide](handbook/repository/external-contribute.md).

## Prerequisites

- You have Node installed `>= 12.0.0` and Yarn at `>= 1.20.0`.
- You have [java](https://www.java.com/en/download/manual.jsp) installed.
- You have [Docker](https://docs.docker.com/desktop/) installed.
- Run `yarn` to install the dependencies.

## Usage

There are many projects that can be built and run. [Click here to see the full list](https://github.com/island-is/island.is/blob/main/nx.json).

### Development server

For a dev server:

```bash
yarn start <project>
```

The app will automatically reload if you change any of the source files.

### Build

To build the project:

```bash
yarn build <project>
```

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Formatting your code

You need to format all files to follow NX code conventions. To do so run:

```bash
yarn nx format:write
```

### Running lint checks

We have many lint rules to help having a unify code all over the project. To execute the linting:

```bash
yarn lint <project>
```

> Running lint locally is slow and fill up heap memory. This is related to Typescript compilation and NX lint builder being slow. As a result you might get a `JavaScript heap out of memory`. NX is working on fixing this for an upcoming update. In the meantime you can do `NODE_OPTIONS=“--max-old-space-size=4096” yarn lint <project>` to raise the memory limit.

### Running unit tests

To execute the unit tests via [Jest](https://jestjs.io):

```bash
yarn test <project>
```

To execute the unit tests affected by a change:

```bash
yarn affected:test
```

### Running end-to-end tests

To execute end-to-end tests via [Cypress](https://www.cypress.io):

```bash
yarn e2e <project>-e2e
```

To execute the end-to-end tests affected by a change:

```bash
yarn affected:e2e
```

### Schemas

If your project is generating schemas files from an OpenAPI, Codegen or is an API, check out [this documentation](handbook/repository/schemas.md).

### Understand your workspace

To see a diagram of the dependencies of your projects:

```bash
yarn nx dep-graph
```

### Making dev secrets available locally

Environment variables that should not be tracked but needed locally should be added to the `.env.secret` file.
Additionally, if that same variable is also stored in AWS Parameter Store, the secret can be labeled with the `dev` label from `History` -> `Attach labels`.

All secrets labeled with the `dev` label can be fetched using `yarn get-secrets`.

### Fetch development secrets for your project

```bash
yarn get-secrets <project> [options]
```

**Example**:

```bash
yarn get-secrets gjafakort --reset
```

### Environment variables with static websites

To be able to access environment variables in purely static projects, you need
to do the following:

1. In the index.html file, add `<!-- environment placeholder -->`.
2. Use the `getStaticEnv` function from the `@island.is/utils/environment`
   library to fetch your environment variables.
3. Prefix your environment variables with `SI_PUBLIC_`, for example
   `SI_PUBLIC_MY_VARIABLE`.

NOTE: This is only to get environment variables when running in kubernetes, not
for when running locally. So you should only use `getStaticEnv` in your
`environment.prod.ts` file.

What happens behind the scenes is that static projects have a bash script that
runs when the docker container starts up. This script searches for references
of `SI_PUBLIC_*` in the code and tries to find a match in the environment. It
then puts all the matches inside the index.html which is then served to the
client.
