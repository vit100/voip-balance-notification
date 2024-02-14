const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

module.exports = async function sendMailAsync(balanceData) {
  const balanceFormatted = `${Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balanceData.balance)}`;
  const thresholdFormatted = `${Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balanceData.threshold)}`;
  const text = `Dear ${balanceData.firstName},
    We are writing to inform you that your balance for phone service on voipinterface.net has dropped below the threshold limit of ${thresholdFormatted}.
    This is a reminder to make a payment to avoid any service interruption. Your current balance: ${balanceFormatted}.
    You can make a payment online by logging into your account at voipinterface.net.
    We appreciate your business and hope you enjoy our phone service. If you have any questions or concerns, please do not hesitate to contact us - Vitaliy is your point of contact.
    Sincerely, 
    VoipRobot`;

  const html = `<p>Dear ${balanceData.firstName},</p>
    <p>We are writing to inform you that your balance for phone service on voipinterface.net has dropped below the threshold limit of ${thresholdFormatted}.</p>
    <p>This is a reminder to make a payment to avoid any service interruption. Your current balance: ${balanceFormatted}.</p>
    <p>You can make a payment online by logging into your account at <a href="voipinterface.net">voipinterface.net</a>.</p>
    <p>We appreciate your business and hope you enjoy our phone service. If you have any questions or concerns, please do not hesitate to contact us - Vitaliy is your point of contact.</p>
    <p>Sincerely,</p>
    <p>VoipRobot</p>`;

  const msg = {
    to: balanceData.email,
    from: process.env.SEND_FROM_EMAIL,
    subject: "Low balance for your phone service.",
    text: text,
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log(`${Date()}. Email sent to ${balanceData.email}, ${text}`);
    })
    .catch((error) => {
      console.error(error);
    });
};
