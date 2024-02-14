const axios = require("axios");

const method = "getResellerBalance";

const { BASE_URL, BEARER_TOKEN, API_USERNAME, API_PASSWORD } = process.env;

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: `${BASE_URL}?method=${method}&api_username=${API_USERNAME}&api_password=${API_PASSWORD}`,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
};

module.exports = async function getBalancePerClientAsync(clientId) {
  try {
    config.url = `${config.url}&client=${clientId}`;
    const response = await axios.request(config);
    return response.data.balance;
  } catch (error) {
    console.error(Date(), error);
  }
};
