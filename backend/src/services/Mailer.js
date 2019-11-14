const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../config/mail');

var transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
});

const handlebarOptions = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.resolve('./src/public/resources/mail/'),
      layoutsDir: path.resolve('./src/public/resources/mail/'),
    },
    viewPath: path.resolve('./src/public/resources/mail/'),
    extName: '.handlebars',
  };

transport.use('compile', hbs(handlebarOptions));

module.exports = transport;