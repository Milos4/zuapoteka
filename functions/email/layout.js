const fs = require("fs");
const path = require("path");

const signaturePath = path.join(__dirname, "signature.html");
const signature = fs.readFileSync(signaturePath, "utf8");

const emailLayout = (content) => `
  <div style="font-family:Arial;line-height:1.5">
    ${content}
    <hr />
    ${signature}
  </div>
`;

module.exports = { emailLayout };
