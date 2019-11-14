const mailer = require('../../../../../services/Mailer');

const { app_email } = require('../../../../../config/mail');

const sendPasswordChangeNotification = (email) => {
    const mailOptions = {
        to: email,
        from: app_email,
        subject: 'Senha redefinida com sucesso',
        template: '/auth/passwordChangeNotification/password-change-notification'
    };

    mailer.sendMail(mailOptions, (err) => {
        if(err)
            console.log(err);
    });
}

module.exports = sendPasswordChangeNotification;