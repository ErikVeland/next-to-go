# Next To Go demo app

This VueJS demo app accesses the public TAB API to display the next races, with filters for greyhounds, thoroughbreds and harness.

If run as localhost, it requires server allowing cross origin requests, or disabling Cross Origin Restrictions in the browser (Safari: Developer menu; Chrome: --disable-web-security flag OR Allow-Control-Allow-Origin plugin). If server is unable to access the live API, a fallback to static data for 8 Aug 2017 occurs.

Webpack is used to handle the build compilation for both the server and browser.

## How to

To start the app run the following in order:

```
npm install
```

To start the server run:

```
npm run dev
```

You can access the app at localhost:8080 on your machine.


To build:

```
npm run build
```
You can access the app by index.html.

## Credit

Erik Veland 7 Aug 2017
Data and icons © Tabcorp Holdings Limited 2017