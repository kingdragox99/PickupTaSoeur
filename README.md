# PickupTaSoeur Pickup Site

## Pickup Platform for csgo

### Techo

- Express Js
- Socket.io
- EJS
- Tailwind css

### NPM PACK

- dotenv
- Steam Login
- Express session
- node fetch
- uuid
- steam id converter

### to do

- Transport EJS to Vue
- Fetch lvl faceit and MatchMaking rank
- Make room [x]
- Make a random capt
- Pick Player
- Veto map
- Lunch server on the right map with rcon
- make css style but la flemme

### setup

```bash
npm i
```

need to create SSL folder and add .prem

```bash
openssl genrsa -out key.pem

openssl req -new -key key.pem -out csr.pem

openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

need to make a .env

and add you steam api key [find here](https://steamcommunity.com/dev/apikey)

```json
PORT_HTTP = "80"
PORT_HTTPS = "8080"
PORT_WS = "WEBSOCKET PORT"
URL = "URL OR LOCALHOST"
STEAM_API = "YOUR API KEY"
TRN_API_KEY = "YOUR API KEY"
```

```bash
npm run start
```

#### Made with love by Dragolelele
