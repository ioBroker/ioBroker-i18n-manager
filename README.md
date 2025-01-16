<img src="logo/horizontal.png" alt="i18n-manager" height="120px">

![CI](https://github.com/gilmarsquinelato/i18n-manager/workflows/CI/badge.svg?branch=development)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8acca046a7fc462fbfe69677984cff91)](https://www.codacy.com/project/gilmarsquinelato/i18n-manager/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gilmarsquinelato/i18n-manager&amp;utm_campaign=Badge_Grade_Dashboard)
[![Known Vulnerabilities](https://snyk.io/test/github/gilmarsquinelato/i18n-manager/badge.svg?targetFile=package.json)](https://snyk.io/test/github/gilmarsquinelato/i18n-manager?targetFile=package.json)
![GitHub All Releases](https://img.shields.io/github/downloads/gilmarsquinelato/i18n-manager/total)
![GitHub Releases](https://img.shields.io/github/downloads/gilmarsquinelato/i18n-manager/latest/total)

------

This app was developed with the objective to help the developers to manage the app translations.

Any type of contributions are welcome.

## Features

* Detect changed, missing, duplicated/untranslated keys and added translations
* Add, remove and rename translation keys (context menu)
* Nested keys support
* Google Translate™ API Integration
* File changes detection
* It's free! 🙂

## Current plugins and their supported extensions

* json - [.json, .arb (Flutter Internationalization)]
* yaml - [.yaml, .yml]

**Feature requests and/or pull requests with new plugins are welcomed 🙂**

**If you want to test the features, you can open the testData folder!**

## Projects using i18n Manager

* [Phoenix - Burst Coin Wallet UI](https://github.com/burst-apps-team/phoenix)

## Screenshots

![](./screenshots/pic-1.png)

![](./screenshots/pic-2.png)

![](./screenshots/pic-3.png)

## Setup

`npm install`

## Developing

`npm run start`

then  
1 - `cross-env NODE_ENV=development npm run start:web`  
2 - `cross-env NODE_ENV=development npm run start:main`  

## Building

`npm build`

then one of the following:
```shell
npm run build:win
npm run build:mac && echo "(serve for mac)"
npm run build:linux
```

## Contributors

Logo designed by [@reallinfo](https://github.com/reallinfo)
