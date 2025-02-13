const nodemailer = require('nodemailer');
require('dotenv').config();

const MAIL_HOST = process.env.EMAIL_HOST;
const MAIL_USER = process.env.EMAIL_USER;
const MAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const IMAP_USER = process.env.IMAP_USER;
const IMAP_PASSWORD = process.env.IMAP_PASSWORD;
const IMAP_HOST = process.env.IMAP_HOST;

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

export const configImap = {
  imap: {
    user: IMAP_USER,
    password: IMAP_PASSWORD,
    host: IMAP_HOST,
    port: 993,
    tls: true,
    authTimeout: 10000,
    connTimeout: 30000,
    tlsOptions: { rejectUnauthorized: false },
  },
};
