# voip-balance-notification

https://github.com/vit100/voip-balance-notification
---
> [!NOTE]  
> Voip.ms failed to fix their issue with sending balance notification from voipinterface.net domain, though that domain belongs to them.
>
> This app will send email to reseller customers of VOIP.ms via sendgrid.

## Configuration
### 1. Sendgrid configuration

This app is using Sendgrid's templates. You need to create one, it will give you `TEMPLATEID` which you will use in app configuration later.

Sendgrid Template engine is based on Handlebars (see details [here]( https://docs.sendgrid.com/for-developers/sending-email/using-handlebars/)).
Data object for template has this shape:
```json
{
"firstName": "string",
"lastName": "string",
"balanceFormatted": "USD currency formatted string",
"thresholdFormatted": "USD currency formatted string",
}
```

### 2. Voip.ms API access configuration
Details are [here](https://voip.ms/business/resources/api).

**TL;DR** You need to enable API access on voip.ms portal and it will give you 3 params for your app config below: `BEARER_TOKEN`, `API_USERNAME`, `API_PASSWORD`.

### 3. App configuration:
Make copy of `.env_sample` and name it as `.env`

```text
// this from voip.ms portal, API access section
BASE_URL="https://voip.ms/api/v1/rest.php"
BEARER_TOKEN="<TOKEN>"
API_USERNAME="<Portal email>"
API_PASSWORD="API password"

SENDGRID_KEY="SENDGRID KEY - voipinterface-balance-notifications"
SENDGRID_TEMPLATEID="<id of dynamic template from sendgrid>"

// Change to your verified sender
SEND_FROM_EMAIL="info@your-domain.com"

//Run every min
CRON_SCHEDULE="* * * * *"
//Run every midnight
//CRON_SCHEDULE="0 0 * * *"
```

## How to run.
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
      BASE_URL: ${BASE_URL}
      BEARER_TOKEN: ${BEARER_TOKEN}
      API_USERNAME: ${API_USERNAME}
      API_PASSWORD: ${API_PASSWORD}
      SENDGRID_KEY: ${SENDGRID_KEY}
      SENDGRID_TEMPLATEID: ${SENDGRID_TEMPLATEID}
      SEND_FROM_EMAIL: ${SEND_FROM_EMAIL}
      SEND_FROM_NAME: ${SEND_FROM_NAME}
      BCC: ${BCC}
      CRON_SCHEDULE: ${CRON_SCHEDULE}
```