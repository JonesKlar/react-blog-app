# Projektarbeit - JK

Live site: [https://jonesklar.github.io/react-blog-app/](https://jonesklar.github.io/react-blog-app/)

`web.config` is currently not needed, works without it to be deployed to IIS on docker image.

## App doesnt run

Check which settings are set in `.env.development` when running the dev build
or `.env.production` when running production build!

## Starten der Anwendung

0. `npm i json-server -g`
1. `npm i`
2. `npm run dev`

json db server usually starts at localhost:5000

## json.db server

Install: `npm i json-server -g` 

!!! dont save the db.json file inside your project folder !!!

if you do that, you will get unexpoected page refreshes

you have to specify the location of the `db.json` file in `package.json` => `scripts:{...}`:

     "start:api": "json-server --watch ../db.json --port 5000",


## Kurze Intro

Einloggen mit folgenden bereits erstellten credentials möglich:

Username => Password
- user  => user
- admin => admin

Ich habe zusätzlich noch eine Seite `AdminCommentModerationPage.jsx` in die Anwendung eingebaut, in welcher der Admin Kommentare löschen  kann.

## how to debug on iPhone 

index.html:

    <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
    <script>eruda.init({
        // optional: Panels auswählen
        tool: ['console', 'network', 'elements']
        });
    </script>

 Now access the 192.xxx.... url to the website.


 ## production and dev settings

    1. .env.development
    2. .env.production   

#### .env.development:

    # .env.development
    # Filenames must be exactly .env.development and .env.production.
    # All keys you want to expose to your client code must begin with VITE_.
    # npm run dev       # uses .env.development
    # npm run build     # build uses .env.production
    # npm run preview   # preview uses .env.production

    VITE_API_URL_WEB=http://localhost:5173
    VITE_API_URL_DB=http://localhost:5000

#### .env.production:

    # .env.production
    # Filenames must be exactly .env.development and .env.production.
    # All keys you want to expose to your client code must begin with VITE_.
    VITE_API_WEB=http://192.168.1.22:4173
    VITE_API_URL_DB=http://192.168.1.22:5000

## browser compatability

### package.json:

    "browserslist": [
        "last 5 Chrome versions",
        "last 5 Firefox versions",
        "last 5 Safari versions",
        "last 5 iOS versions",
        "last 5 Edge versions",
        "not dead",
        "not IE 11"
    ],

### postcss.config.js

    export default {
        plugins: {
            "@tailwindcss/postcss": {},
            autoprefixer: {},
        }
    }

## Dependencies React, vite, tailwind.css, daisyUI

    "dependencies": {
        "@tailwindcss/vite": "^4.1.5",
        "react": "^19.1.0",
        "react-dom": "^19.1.0",
        "react-icons": "^5.5.0",
        "react-router": "^7.6.0",
        "react-toastify": "^11.0.5"
    },
    "devDependencies": {
        "@eslint/js": "^9.25.0",
        "@tailwindcss/postcss": "^4.1.5",
        "@types/react": "^19.1.2",
        "@types/react-dom": "^19.1.2",
        "@vitejs/plugin-react": "^4.4.1",
        "autoprefixer": "^10.4.21",
        "concurrently": "^9.1.2",
        "daisyui": "^5.0.35",
        "eslint": "^9.25.0",
        "eslint-plugin-react-hooks": "^5.2.0",
        "eslint-plugin-react-refresh": "^0.4.19",
        "globals": "^16.0.0",
        "postcss": "^8.5.3",
        "sass": "^1.87.0",
        "tailwindcss": "^4.1.5",
        "vite": "^6.3.5"
    }


## Setup server: vite.config.js

    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from '@tailwindcss/vite'


    // https://vite.dev/config/
    export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true,      // shorthand for 0.0.0.0
        port: 5173,
    },
    })

https://vite.dev/config/server-options.html


## start development

    npm i
    nmp run dev

## start production

    npm run build
    npm run serve:prod

## tailwind-daisyUI-configuration

    // tailwind.config.js

    import daisyui from "daisyui";

    export default {
        content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
            extend: {
                animation: {
                    'fade-in': 'fadeIn 0.5s ease-in-out',
                },
                keyframes: {
                    fadeIn: {
                        '0%': { opacity: 0 },
                        '100%': { opacity: 1 },
                    },
                },
            },
        },
        daisyui: {
            themes: ["cupcake", "dark", "light", "bumblebee"],
        },
        plugins: [daisyui]
    }


### index.css

    @import "tailwindcss";
    @plugin "daisyui";
    @import 'react-toastify/dist/ReactToastify.css';
    @import './App.css';

