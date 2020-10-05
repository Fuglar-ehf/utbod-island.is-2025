# Ísland

This repository is the center of development for digital government
services on `island.is`. It is managed by the [Digital Iceland] department
inside the [Ministry of Finance and Economic Affairs].

These solutions are [FOSS] and open to contributions, but most development
is performed by teams that win tenders to develop new functionality for
Digital Iceland.

[digital iceland]: https://stafraent.island.is/
[ministry of finance and economic affairs]: https://www.government.is/ministries/ministry-of-finance-and-economic-affairs/
[foss]: https://en.wikipedia.org/wiki/Free_and_open-source_software

## How to contribute

We are working on documentation and workflows to help external developers understand and run these solutions locally.

For now, we appreciate assistance with security reviews (more eyes = better), documentation and smaller fixes.

### Reading material

A good place to start is the [Development Handbook](https://github.com/island-is/handbook).

You can also read up on our development stack and preferred tools:

#### General

| Tool         | Description                         |
| ------------ | ----------------------------------- |
| [NodeJS]     | scripts and server-side framework   |
| [TypeScript] | programming language                |
| [NX]         | monorepo tools and code scaffolding |

#### Frontend

| Tool                     | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| [React]                  | UI framework                                               |
| [NextJS]                 | front-end framework with routing and server side rendering |
| [Treat]                  | css-in-js                                                  |
| [Storybook]              | develop and document React components in isolation         |
| [Apollo Client]          | graphql client                                             |
| [GraphQL Code Generator] | generate GraphQL clients and types                         |
| [Cypress]                | automated browser testing tool                             |
| [MirageJS]               | API mocking for webapps                                    |

#### Backend

| Tool                | Description                                 |
| ------------------- | ------------------------------------------- |
| [NestJS]            | server-side framework for NodeJS            |
| [Sequelize]         | database object relational mapper           |
| [OpenAPI Generator] | generate clients and types for OpenAPI APIs |

#### Code Quality

| Tool       | Description            |
| ---------- | ---------------------- |
| [Jest]     | automated testing tool |
| [ESLint]   | code checker           |
| [Prettier] | code formatter         |

#### Protocols and specifications

| Tool              | Description                            |
| ----------------- | -------------------------------------- |
| [GraphQL]         | api protocol for our frontend projects |
| [OpenAPI]         | specification to describe rest apis    |
| [Open ID Connect] | authentication protocols               |

#### Repositories

| Tool         | Description                        |
| ------------ | ---------------------------------- |
| [PostgreSQL] | SQL database                       |
| [Contentful] | headless content management system |

#### Infrastructure

| Tool         | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| [Docker]     | virtual machine containers for continuous integration and deployment |
| [Kubernetes] | host docker containers in production                                 |
| [Helm]       | kubernetes deployment configuration                                  |

[nodejs]: https://nodejs.org/en/
[typescript]: https://www.typescriptlang.org/
[nx]: https://nx.dev/react
[nestjs]: https://nestjs.com/
[treat]: https://seek-oss.github.io/treat/
[react]: https://reactjs.org/
[nextjs]: https://nextjs.org/
[graphql]: https://graphql.org/
[apollo client]: https://www.apollographql.com/docs/react/
[graphql code generator]: https://graphql-code-generator.com/
[openapi]: https://www.openapis.org/
[openapi generator]: https://openapi-generator.tech/
[storybook]: https://storybook.js.org/
[jest]: https://jestjs.io/
[cypress]: https://www.cypress.io/
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[sequelize]: https://sequelize.org/
[open id connect]: https://openid.net/connect/
[postgresql]: https://www.postgresql.org/
[miragejs]: https://miragejs.com/
[contentful]: https://www.contentful.com/
[docker]: https://www.docker.com/
[kubernetes]: https://kubernetes.io/
[helm]: https://helm.sh/

## Repository structure

The repository is a [monorepo](https://github.com/island-is/handbook/blob/master/monorepo.md) that has multiple apps (something that can be built and run) and libraries (which other apps and libraries can depend on).

Our system architecture generally includes frontend projects, a graphql API gateway, and service APIs. Many of these projects are in early development.

Featured projects:

- [Island.is website](./apps/web)
- [Application system](./apps/application-system)
- [Service Portal](./apps/service-portal)
- [Shared GraphQL API](./apps/api)
- [Island UI design system](./libs/island-ui)

Other projects:

- [Digital Judicial System](./apps/judicial-system)
- [Travel Gift](./apps/gjafakort)
- [Air Discount Scheme](./apps/air-discount-scheme)
- [COVID Activities](./apps/adgerdir)

## Working in the monorepo

### Development server

Run `yarn start <project>` for a dev server. The app will automatically reload if you change any of the source files.

### Build

Run `yarn build <project>` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `yarn test <project>` to execute the unit tests via [Jest](https://jestjs.io).

Run `yarn affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `yarn e2e <project>-e2e` to execute end-to-end tests via [Cypress](https://www.cypress.io).

Run `yarn affected:e2e` to execute the end-to-end tests affected by a change.

### Generate a component

Run `yarn generate @nrwl/react:component MyComponent --project=island-ui-core` to generate a new component in island-ui-core.

### Generate an application

Run `yarn generate @nrwl/react:app my-app` to generate a simple React application.

To get a React application with server-side-rendering, we recommend using Next.JS: `yarn generate @nrwl/next:app my-app`

To create a service, you can get started with NestJS like this: `yarn generate @nrwl/nest:app services/my-service`

### Generate a library

Run `yarn generate @nrwl/react:lib my-lib --linter eslint` to generate a React library.

To create a NestJS module: `yarn generate @nrwl/node:lib my-lib`

To create a JS library that can be used both on the frontend and the backend: `yarn generate @nrwl/node:lib my-lib`

Libraries are sharable across libraries and applications. They can be imported from `@island.is/my-lib`.

Applications and libraries can be structured in a hierarchy using subfolders:

```
yarn generate @nrwl/node:lib common/my-lib

# Imported from '@island.is/common/my-lib'
```

### Migrations

Using the `sequelize-cli` we support version controlled migrations that keep track of changes to the database.

#### Generate a migrations

Run `yarn nx run <project>:migrate/generate`

#### Migrating

Run `yarn nx run <project>:migrate`

### Schemas and types

All generated files are ignored from the git repository to avoid noises (except contentfulTypes.d.ts that we will keep tracked), to make reviews easier on PRs and don't notify teams with code reviews when not needed.

Once you do a `yarn install`/`npm install`, a postinstall script will generate all the schemas and types for the whole project. It takes around ~30sec to generate all schemas, definitions types and open api schemas.

The normal development process stays the same, `e.g. yarn start api` will keep generating on the fly the schemas files.

However, if you need to generate all the schemas files manually, you can do it with `yarn schemas`. Besides you can generate schemas, project by project with the following `yarn nx run <project>:init-schema`.

### Generating schemas and types for a new library/application

- You will need to create a `buildSchema.ts`, if your project has a graphql module. (e.g. [air-discount-scheme-api](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/apps/air-discount-scheme/api/src/buildSchema.ts))
- You will need to create a `buildOpenApi`, if your project has an open api. (e.g. [application-system-api](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/apps/application-system/api/src/buildOpenApi.ts))
- You will need to create a `codegen.yml`, if your project is a react application. (e.g. [adgerdir](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/apps/adgerdir/codegen.yml))

It's very common to create more than one file for the same project, for example the `buildSchema` and a `codegen`. Once you have one or multiple of these file, you can create your workspace architect:

- `yarn schemas` runs all the `init-schema` that it can find for all the targets inside the workspace. If you create a new `init-schema` and place it your newly created file it will be triggered during postinstall. (e.g. [air-discount-scheme-api architect](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/workspace.json#L1584-L1593), [application-system-api architect](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/workspace.json#L2032-L2037), [adgerdir architect](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/workspace.json#L2161-L2172))

### Generate schema and client types

All api calls should be type checked to backend schemas. When you update an API, you may need to generate schema files:

```
yarn nx run <project>:generate-schema
```

And generate client types that depend on the schema:

```
yarn nx run <project>:codegen
```

### Understand your workspace

Run `yarn nx dep-graph` to see a diagram of the dependencies of your projects.

### Fetch development secrets for your project

Run `yarn env-secrets <project> [options]`

**Example**:

```
yarn env-secrets gjafakort --reset
```
