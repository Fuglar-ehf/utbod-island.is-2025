# Personal Representative Public

## About

A service that is responsible for giving third party service providers information about personal representatives and their rights

### Initial setup

We are using the same service library and database as auth-api and therefore this step by step represents that
First, make sure you have docker, then run:

```bash
yarn dev-services services-auth-api
```

Then run the migrations:

```bash
yarn nx run services-auth-api:migrate
```

You can serve this service locally by running:

```bash
yarn start services-personal-representative-public
```

Api open api specs will now be accessible at

```bash
http://localhost:3378
```

## Testing

You can run tests for this service locally by running:

```bash
yarn test services-personal-representative-public
```

## Getting started

```bash
yarn start services-personal-representative-public
```

## Code owners and maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)
