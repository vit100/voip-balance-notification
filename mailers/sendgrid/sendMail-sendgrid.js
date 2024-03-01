const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const { inspect } = require("util");

module.exports = async function sendMailAsync(balanceData) {
  const balanceFormatted = `${Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balanceData.balance)}`;
  const thresholdFormatted = `${Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balanceData.threshold)}`;

  const msg = {
    to: {
      name: `${balanceData.firstName} ${balanceData.lastName}`,
      email: balanceData.email,
    },
    from: {
      name: process.env.SEND_FROM_NAME,
      email: process.env.SEND_FROM_EMAIL,
    },
    bcc: [process.env.SEND_BCC],
    template_id: process.env.SENDGRID_TEMPLATEID,
    dynamicTemplateData: {
      firstName: balanceData.firstName,
      lastName: balanceData.lastName,
      balanceFormatted,
      thresholdFormatted,
    },
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log(
        `${Date()}. Email sent ${JSON.stringify(msg)}`
      );
    })
    .catch((error) => {
      console.error(`${Date()}.`, inspect(error, null, null, true));
    });
};
