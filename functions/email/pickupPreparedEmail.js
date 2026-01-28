const { emailLayout } = require("./layout");

const pickupPreparedEmail = ({ orderId, ime }) => {
  const content = `
    <p>Poštovani ${ime},</p>

    <p>
      Vaša porudžbina <strong>#${orderId}</strong> je
      <strong>pripremljena</strong> i spremna za preuzimanje u apoteci.
    </p>

    <p>
      Možete doći po svoju porudžbinu u toku radnog vremena apoteke.
    </p>

    <p>Hvala na povjerenju,<br/>Apoteka Higra Sarić</p>
  `;

  return emailLayout(content);
};

module.exports = { pickupPreparedEmail };