const { emailLayout } = require("./layout");

const contactReplyEmail = ({ ime, odgovor }) => {
  const content = `
    <p>Poštovani ${ime},</p>

    <p>Odgovor na Vašu poruku:</p>

    <blockquote style="border-left:3px solid #ccc;padding-left:10px;">
      ${odgovor}
    </blockquote>

    <p>Ukoliko imate dodatna pitanja, slobodno nam se obratite.</p>
  `;

  return emailLayout(content);
};

module.exports = { contactReplyEmail };
