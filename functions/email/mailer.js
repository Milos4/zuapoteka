const nodemailer = require("nodemailer");

// Ovo je Gmail account koji će slati email-ove
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "info@apoteka-higrasaric.ba",
    pass: "wythvuaslwlwafsa",
  },
});

module.exports = { transporter };
