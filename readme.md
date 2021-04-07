# Pulsar
## Environment variables

These are the default environment variables use in the production config.

#### `REACT_APP_BASE_URL`

Set this to your base app url. Your default web:did will be based on this when it gets created on first run.

#### `API_KEY`

Used for authorization

#### `SECRET_KEY`

Used for encrypting the database

#### `OPENSEA_API_KEY`

API_KEY for the opensea router (prevents rate-limiting)

#### `AGENT_ENDPOINT`

The url where the agent will be accessible from

#### `PORT`

The port to run the server on

#### `DATABASE_URL`

# Running locally

```
yarn
yarn build
```

Run in a separate terminal:

```
ngrok http 3332
```

Copy https URL (https://AAABBBCCC.ngrok.io)

In `package.json` file, replace `REACT_APP_BASE_URL=https://pulsar.veramo.dev` to `REACT_APP_BASE_URL=https://AAABBBCCC.ngrok.io`

Replace `baseUrl: https://e23152b060bc.ngrok.io` to `baseUrl: https://AAABBBCCC.ngrok.io` in `config/agent-local.yml`


Run:
```
yarn dev
```


In `app/package.json` file, replace `REACT_APP_BASE_URL=https://pulsar.veramo.dev` to `REACT_APP_BASE_URL=https://AAABBBCCC.ngrok.io`

and `REACT_APP_DEFAULT_RECIPIENT=did:web:AAABBBCCC.ngrok.io` to `REACT_APP_DEFAULT_RECIPIENT=did:web:AAABBBCCC.ngrok.io`

Run:
```
yarn start
```