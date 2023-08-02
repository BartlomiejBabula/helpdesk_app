const nodemailer = require("nodemailer");
require("dotenv").config();

const MAIL_HOST = process.env.EMAIL_HOST;
const MAIL_USER = process.env.EMAIL_USER;
const MAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL = process.env.EMAIL;

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: 587,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  // logger: true,
  // debug: true,
});

transporter.verify(function (error: any, success: any) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
