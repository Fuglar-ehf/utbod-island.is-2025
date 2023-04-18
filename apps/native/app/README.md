# Ísland.is App

This is the native app Ísland.is for iOS and Android.

## Installation

```bash
yarn install
bundle install
npx pod-install
```

### Building for iOS

```bash
yarn run ios
```

### Building for Android

```bash
yarn run android
```

### Start development server

```
yarn start
```

## NX commands

NX command example to proxy arguments to `package.json` scripts

```bash
nx run native-app:script --name=<some-script-from-package.json>
```

```bash
nx run native-app:schemas/codegen
```

## NOTES

- ci jobs
  - codegen
  - lint
  - build
  - test
