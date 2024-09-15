const axios = require("axios");

const method = "getClientThreshold";

const { BASE_URL, BEARER_TOKEN, API_USERNAME, API_PASSWORD } = process.env;

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: `${BASE_URL}?method=${method}&api_username=${API_USERNAME}&api_password=${API_PASSWORD}`,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
};

module.exports = async function getClientThresholdAsync(clientId) {
  try {
    const url = `${config.url}&client=${clientId}`;
    const response = await axios.request({...config, url});
    return response.data.threshold_information;
  } catch (error) {
    console.error(Date(), error);
  }
};
