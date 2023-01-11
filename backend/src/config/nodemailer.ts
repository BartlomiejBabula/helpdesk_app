const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "babula.software@gmail.com",
    pass: "melo mfcu ynsc uunk",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
