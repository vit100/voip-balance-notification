# voip-balance-notification

> [!NOTE]  
> Voip.ms failed to fix their issue with sending balance notification from voipinterface.net domain, though that domain belongs to them.
>
> This app will send email to reseller customers of VOIP.ms via sendgrid.

## How to use
### Configuration:
Make copy of `.env_sample` and name it as `.env`

```text
// this from voip.ms portal, API access section
BEARER_TOKEN="<TOKEN>"
API_USERNAME="<Portal email>"
API_PASSWORD="API password"

SENDGRID_KEY="SENDGRID KEY - voipinterface-balance-notifications"

// Change to your verified sender
SEND_FROM_EMAIL="info@your-domain.com"

//Run every min
CRON_SCHEDULE="* * * * *"
//Run every midnight
//CRON_SCHEDULE="0 0 * * *"

BASE_URL = "https://voip.ms/api/v1/rest.php"
```


1. ### Node
```shell
npm run install
npm run start
```
2. ### Docker
```shell
docker run --rm -e BEARER_TOKEN="<YOUR TOKEN>" -e API_USERNAME="<YOUR voip.ms EMAIL>" -e API_PASSWORD="<YOUR PASS>" -e SENDGRID_KEY="" -e SEND_FROM_EMAIL="" -e CRON_SCHEDULE="* * * * *" -e BASE_URL="https://voip.ms/api/v1/rest.php" vit100/voip-balance-notification
```

3. ### Docker-compose

env variables by default are defined in `.env`, load it explicitly with param --env-file.
```shell
docker compose --env-file .env up --build --pull always
``` 

Create compose.yaml file. Values in `${}` will be replaced with values from `.env` file.
```yaml
services:
  voip-balance-notification:
    container_name: voip-balance-notification
    image: vit100/voip-balance-notification
    restart: unless-stopped
    build:
      context: .
    environment:
      NODE_ENV: production
      BEARER_TOKEN: ${BEARER_TOKEN}
      API_USERNAME: ${API_USERNAME}
      API_PASSWORD: ${API_PASSWORD}
      SENDGRID_KEY: ${SENDGRID_KEY}
      SEND_FROM_EMAIL: ${SEND_FROM_EMAIL}
      CRON_SCHEDULE: ${CRON_SCHEDULE}
      BASE_URL: ${BASE_URL}
```