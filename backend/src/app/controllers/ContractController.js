const User = require('../database/models/User');
const Job = require('../database/models/FreelanceWork');
const Contract = require('../database/models/Contract');
const Authenticator = require('../util/Authenticator');

module.exports = {
    async store(req, res) {
        const { id:employer } = await Authenticator.decode(req.headers.authentication);
        const { employee, job, price, note, form_of_payment } = req.body;

        const user = await User.findOne({ _id:employer });

        if(form_of_payment === 'bitpoints' && user.bitpoints < price)
            return res.json({ code: 202, error: 'Bitpoints insuficientes.' });

        const contract = await Contract.create({
            employer,
            employee,
            job,
            price,
            note,
            form_of_payment
        });

        if(form_of_payment === 'bitpoints') {
            const resultingBitpoints = user.bitpoints - price;

            await User.updateOne({ _id:employer }, {
                '$set': {
                    bitpoints: resultingBitpoints
                }
            });
        }

        return res.json(contract);
    },

    async getHistory(req, res) {
        const { id:employer } = await Authenticator.decode(req.headers.authentication);

        const contracts = await Contract.find({ employer });

        return res.json(contracts);
    },

    async changeStatus(req, res) {
        const { authentication } = req.headers;
        const { id:userId } = await Authenticator.decode(authentication);
        const { contract:_id, status } = req.body;
        
        const contract = await Contract.findOneAndUpdate({ _id, employer: userId }, { status }, { new: true });
        return res.json(contract);
    }
}