# Pulsar

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