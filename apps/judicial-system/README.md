# Judicial System

## About

TODO

## URLs

- Dev: N/A
- Staging: N/A
- [Production](https://rettarvorslugatt.island.is)

## API

### Running locally

You can serve this service locally by running:

```bash
yarn start judicial-system-api
```

### Graphql playground

Visit

```text
localhost:3333/api/graphql
```

## Backend

### Initial setup

First, make sure you have docker, then run:

```bash
yarn dev-services judicial-system-backend
```

Then run the migrations and seed the database:

```bash
yarn nx run judicial-system-backend:migrate
```

```bash
yarn nx run judicial-system-backend:seed:all
```

### Running locally

You can serve this service locally by running:

```bash
yarn start judicial-system-backend
```

To enable SMS notifications to an on-call judge provide a password for the SMS service and a judge mobile number:

```bash
NOVA_PASSWORD=<SMS password> JUDGE_MOBILE_NUMBER=<judge mobile number> yarn start judicial-system-backend
```

Similarly, you can enable electronic signatures of judge rulings by providing a Dokobit access token: `DOKOBIT_ACCESS_TOKEN=<Dokobit access token>`

To enable email sending you can modify `emailOptions` in `environment.ts` as follows:

```typescript
emailOptions: {
  useTestAccount: false,
  options: {
    region: 'eu-west-1',
  },
},
```

Finally, to enable prison email notifications provide a prison email address: `PRISON_EMAIL=<prison email>`

### Graphql

Make sure you are serving the graphql client as well in order for you to make graphql calls to this service:

```bash
yarn start judicial-system-api
```

### OpenApi and Swagger

Visit

```bash
localhost:3344/api/swagger
```

### Database changes

Migrations need to be created by hand.

## Web

A platform for the exchange of data, information, formal decisions and notifications between parties in the Icelandic judicial system.

### Start the application locally

Start the backend locally. Instructions on how to do that can be found [in the backend project](projects/judicial-system/backend.md).

Start the application

```bash
yarn start judicial-system-web --ssl
```

Then the project should be running on https://localhost:4200/.

{% hint style="warning" %}
To skip authentication at innskraning.island.is navigate to `/api/auth/login?nationalId=<national_id>` in the web project where `<national_id>` is the national id of a known user.
You can skip `--ssl` but then authentication through innskraning.island.is will fail. The project should now be running on http://localhost:4200/.
{% endhint %}

### Running the tests

```bash
yarn test judicial-system-web
```

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
