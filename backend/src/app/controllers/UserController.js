const User = require('../database/models/User');
const Authenticator = require('../util/Authenticator');

const getUser = async (authentication) => {
    const decoded = await Authenticator.decode(authentication);

    if(!decoded)
        throw 'User not exists.';

    return await User.findOne({ _id: decoded.id });
}

const getUserById = async(req, res) => {
    const { user_id } = req.headers;
    
    const user = await User.findOne({ _id: user_id });

    return res.json(user);
}

const bitpointRechargestore = async (req, res) => {
    const { authentication, bitpoints } = req.headers;

    await getUser(authentication).then(async (response) => {
        const query = { '_id': response.id };
        const update = { 'bitpoints': parseInt(bitpoints) };

        const user = await User.findOneAndUpdate(query, update, { new: true });
        return res.json(user);
    }).catch((err) => {
        return res.json({ code: 404, error: err });
    });
}

module.exports = {
    getUser,
    getUserById,
    bitpointRechargestore
}