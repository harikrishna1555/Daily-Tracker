# Daily-Tracker

## Environment variables

- Server: copy `server/.env.example` to `server/.env.development` or `server/.env.production` and fill in values.
- Client: use `client/.env.development` for local dev and `client/.env.production` for production. Vite exposes variables prefixed with `VITE_`.

Start the server in development with environment file loaded (example):

```powershell
# from repository root
cd server
cp .env.development .env # on Windows, copy the file in Explorer or use PowerShell: Copy-Item .env.development .env
npm install
npm run dev
```

Start the client in development:

```powershell
cd client
npm install
npm run dev
```
