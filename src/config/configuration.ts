export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.EXPIRES_IN,
  },

  mailConfig: {
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
    requireTLS: process.env.MAIL_TLS,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
