require("dotenv").config();
var cron = require("node-cron");

if (
  !process.env.BEARER_TOKEN ||
  !process.env.API_USERNAME ||
  !process.env.API_PASSWORD ||
  !process.env.SENDGRID_KEY ||
  !process.env.SEND_FROM_EMAIL
) {
  console.error("Missing required environment variable.");
  process.exit(1);
}

const getClientsAsync = require("./api-calls/getClients");
const getBalancePerClientAsync = require("./api-calls/getBalancePerClient");
const getClientThreshold = require("./api-calls/getClientThreshold");
const sendMailAsync = require("./mailers/sendgrid/sendMail-sendgrid");

async function getBalances() {
  const clientBalances = [];
  const clients = await getClientsAsync();
  for (const client of clients) {
    const balance = await getBalancePerClientAsync(client.client);
    const threshold_information = await getClientThreshold(client.client);
    clientBalances.push({
      clientId: client.client,
      email: threshold_information.email,
      firstName: client.firstname,
      lastName: client.lastname,
      threshold: Number.parseInt(threshold_information.threshold, 10),
      balance: balance.current_balance,
    });
  }

  return clientBalances;
}

async function run() {
  const clientBalances = await getBalances();

  for (const balance of clientBalances) {
    if (balance.balance <= balance.threshold) {
      await sendMailAsync(balance);
    }
  }
}

cron.schedule(process.env.CRON_SCHEDULE || "* * * * *", async () => {
  await run();
});

console.log(
  `Scheduler started. Schedule: ${process.env.CRON_SCHEDULE || "* * * * *"}`
);
