const mailer = require('../../../../../services/Mailer');

const { app_email } = require('../../../../../config/mail');

const sendPasswordResetMail = (email, name, token) => {
    const mailOptions = {
        to: email,
        from: app_email,
        subject: 'Redefinir Senha',
        template: '/auth/resetPassword/password-reset',
        context: {
            name,
            token
        }
    };

    mailer.sendMail(mailOptions, (err) => {
        if(err)
            console.log(err);
    });
}

module.exports = sendPasswordResetMail;