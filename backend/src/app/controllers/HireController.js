const FreelanceWork = require('../database/models/FreelanceWork');
const User = require('../database/models/User');
const Hire = require('../database/models/Hire');

const { checkIfHaveProfessionalProfile } = require('../controllers/ProfessionalProfileController');

const Authenticator = require('../util/Authenticator');

module.exports = {
    async store(req, res) {
        if(!req.headers.authentication || !req.headers.job_id)
            return res.json({ code: 404, error: 'Falta os parâmetros authentication ou job_id no header.' });

        const { id:user_id } = await Authenticator.decode(req.headers.authentication);

        const job = await FreelanceWork.findOne({ _id: req.headers.job_id }).select('+professionalProfileId');

        if(!job)
            return res.json({ code: 404, error: 'Trabalho autônomo não encontrado.' });

        const user = await User.findOne({ _id: user_id });

        var professionalProfile = null;

        try {
            professionalProfile = await checkIfHaveProfessionalProfile(req.headers.authentication);
        } catch(err) {}

        if(professionalProfile)
            if(professionalProfile._id.toString() === job.professionalProfileId.toString())
                return res.json({ code: 203, error: 'Você não pode contratar seu próprio serviço.' });

        if(user.bitpoints < job.price)
            return res.json({ code: 202, error: 'Bitpoints insuficientes.' });

        const userUpdated = await User.findOneAndUpdate({ _id: user_id }, { '$inc' : { bitpoints: - parseInt(job.price) } }, { new: true });

        const hire = await Hire.create({
            contract_info: {
                contractor_user_id: user_id,
                hired_professional_profile_id: job.professionalProfileId
            },
            job: {
                job_id: job._id,
                job: job.job,
                price: job.price
            }
        });

        return res.json({
            your_bitpoints: userUpdated.bitpoints,
            hire
        });
    },

    async showMyHires(req, res) {
        const { id:user_id } = await Authenticator.decode(req.headers.authentication);

        const contractsMadeByYou = await Hire.find({ 'contract_info.contractor_user_id': user_id });

        const professionalProfile = await checkIfHaveProfessionalProfile(req.headers.authentication);

        var professionalContracts = {};
        if(professionalProfile)
            professionalContracts = await Hire.find({ 'contract_info.hired_professional_profile_id': professionalProfile._id });

        return res.json({
            contracts_made_by_you: contractsMadeByYou,
            professional_contracts: professionalContracts
        });
    }
    
}