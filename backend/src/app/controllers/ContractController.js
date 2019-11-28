const User = require('../database/models/User');
const ProfessionalProfile = require('../database/models/ProfessionalProfile');
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

        const contracts = await Contract.find({ employer }).sort({ updatedAt:-1 });

        return res.json(contracts);
    },

    async getMyContracts(req, res) {
        const { id:userId } = await Authenticator.decode(req.headers.authentication);

        const professionalProfile = await ProfessionalProfile.findOne({ userId });

        const contracts = await Contract.find({ employee: professionalProfile._id }).sort({ createdAt:1 });

        return res.json(contracts);
    },

    async changeStatus(req, res) {
        const { authentication } = req.headers;
        const { contract:_id, status } = req.body;

        var id;
        if(authentication)
            id = await Authenticator.decode(authentication);
        else
            id = req.body.my_professional_profile_id;
        
        const contract = await Contract.findOneAndUpdate({ _id, $or:[ {employer: id}, {employee: id} ] }, { status }, { new: true });
        
        return res.json(contract);
    },

    async rate(req, res) {
        const { id:userId } = await Authenticator.decode(req.headers.authentication);
        const { contractId, rate, comment } = req.body;
        
        const contract = await Contract.findOneAndUpdate({ _id: contractId, employer: userId }, { rate, comment }, { new: true });
        
        const job = await Job.findOne({ _id:contract.job } );

        job.rate[`${rate}_star`] = job.rate[`${rate}_star`] + 1;
        await job.save();

        return res.json(contract);
    },
}