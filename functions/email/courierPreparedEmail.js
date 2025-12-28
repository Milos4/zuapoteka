const { emailLayout } = require("./layout");

const courierPreparedEmail = ({ orderId, ime }) => {
  const content = `
    <p>Poštovani ${ime},</p>
    <p>
      Vaša porudžbina <strong>#${orderId}</strong> je pripremljena
      i predata kurirskoj službi.
    </p>
    <p>Kurir će Vas kontaktirati prije isporuke.</p>
  `;
  return emailLayout(content);
};

module.exports = { courierPreparedEmail };
