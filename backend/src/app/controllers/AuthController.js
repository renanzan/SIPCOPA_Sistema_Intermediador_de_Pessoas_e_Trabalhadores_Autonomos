const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Authenticator = require('../util/Authenticator');

const User = require('../database/models/User');
const ProfissionalProfile = require('../database/models/ProfessionalProfile');

const sendMailPasswordReset = require('../../public/resources/mail/auth/resetPassword/index');
const sendMailPasswordChangeNotification = require('../../public/resources/mail/auth/passwordChangeNotification');

module.exports = {
    async index(req, res) {
        const { authentication } = req.headers;

        const { id:_id } = await Authenticator.decode(authentication);

        const user = await User.findOne({ _id });

        if(!user)
            return res.json({ code: 404, error: 'Usuário não encontrado.' });

        // const profissionalProfile = await ProfissionalProfile.findOne({
        //     userId: _id
        // });

        return res.json({
            user,
            // profissionalProfile
        });
    },

    async register(req, res) {
        const { username, password, email } = req.body;

        // Verificação: Redundancia de valor (username)
            const userExists = await User.find({
                username
            });

            if(userExists.length > 0)
                    return res.status(400).send({ error:"The username is already in use." });

        // Verificação: Redundancia de valor (e-mail)
            const emailExists = await User.find({
                email
            });

            if(emailExists.length > 0)
                return res.status(400).json({ error:"Email address is already in use." });

        const user = await User.create({
            username,
            password,
            email
        });
            
        user.password = undefined;

        return res.json({
            user,
            token: Authenticator.generateToken({ id: user._id })
        });
    },

    async authenticate(req, res) {
        const { username, password } = req.body;

        const userExists = await User.find({
            username
        }).select('+password');

        if(userExists.length > 0) {
            const { password:correctPassword } = userExists[0];
            
            if(await bcrypt.compare(password, correctPassword)) {
                userExists[0].password = undefined;

                return res.json({
                    user: userExists[0],
                    token: Authenticator.generateToken({ id: userExists[0]._id })
                });
            }
        }
            return res.status(400).json({ error: "Invalid username and password combination." });
    },

    async forgotPssword(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });
            

            if(!user)
                return res.status(400).send({ error: 'User not found.' });

            const token = crypto.randomBytes(20).toString('hex');

            const expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + 1);

            await User.updateOne({ _id:user._id }, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: expireDate
                }
            });

            sendMailPasswordReset(email, user.username, token);
            return res.status(200).send();

        } catch(err) {
            console.log(err);
            res.status(400).send({ error: 'Erro on forgot password, try again.' });
        }
    },

    async resetPassword(req, res) {
        const { email, token, password } = req.body;

        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

        if(!user)
            return res.status(400).send({ error: 'User not found.'});

        if(token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid.' });

        const now = new Date();

        if(now > user.passwordResetExpires)
            return res.status(400).send({ error : 'Token expired, generate a new one.' });

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        sendMailPasswordChangeNotification(email);

        return res.send();
    }

}