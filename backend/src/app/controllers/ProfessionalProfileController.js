const Nominatim = require('../../services/Nominatim');
const Authenticator = require('../util/Authenticator');

const ProfessionalProfile = require('../database/models/ProfessionalProfile');
const User = require('../database/models/User');
const FreelanceWork = require('../database/models/FreelanceWork');

const index = async (req, res) => {
    const { authentication } = req.headers;
    
    try {
        const professionalProfile = await checkIfHaveProfessionalProfile(authentication);
        return res.json({ professionalProfile });
    } catch(err) {
        return res.json({ err });
    }
}

const get = async (req, res) => {
    const { professional_profile_id } = req.headers;

    const professionalProfile = await ProfessionalProfile.findOne({ _id: professional_profile_id });

    return res.json(professionalProfile);
}

const getByUser = async (req, res) => {
    const { professional_profile_id } = req.headers;

    const professionalProfile = await ProfessionalProfile.findOne({ userId: professional_profile_id });

    const user = await User.findOne({ _id: professional_profile_id });

    var jobs;

    if(professionalProfile)
        jobs = await FreelanceWork.find({ professionalProfileId: professionalProfile._id });

    return res.json({ user, professionalProfile, jobs });
}

const myProfessionalProfile = async (req, res) => {
    const { authentication } = req.headers;

    try {
        const professionalProfile = await checkIfHaveProfessionalProfile(authentication);

        const jobs = await FreelanceWork.find({ professionalProfileId: professionalProfile._id });

        return res.json({ professionalProfile, jobs });
    } catch(err) {
        return res.json({ err });
    }
}

const store = async (req, res) => {
    const { authentication } = req.headers;
    const { id:userId } = await Authenticator.decode(authentication);
    const { imageId, full_name, biography, date_of_birth, phone_number, email, state, city, district, street, number } = req.body;

    await checkIfHaveProfessionalProfile(authentication).then((obj) => {
        return res.json(obj);
    }).catch(async (err) => {
        try {
            const { lat, lon } = await Nominatim.geosearch_structuredData({ state, city, district, street, number })
                .then((result) => {
                    return result.coordinates;
                });

            const profissionalProfile = await ProfessionalProfile.create({
                userId,
                imageId,
                fullName: full_name,
                biography,
                dateOfBirth: date_of_birth,
                phoneNumber: phone_number,
                address: {
                    state,
                    city,
                    district,
                    street,
                    number,
                    coordinates: {
                        lat,
                        lon
                    }
                }
            });

            return res.json(profissionalProfile);
        } catch(err) {
            return res.json({ code: 404, error: err });
        }
    });
}

const update = async (req, res) => {
    const { authentication } = req.headers;
    const { id:userId } = await Authenticator.decode(authentication);
    const { url_photo, full_name, biography, date_of_birth, phone_number, state, city, district, street, number } = req.body;
    
    await checkIfHaveProfessionalProfile(authentication).then(async (obj) => {
        var objForUpdate = {};

        objForUpdate.urlPhoto = url_photo;
        if(full_name) objForUpdate.fullName = full_name;
        if(biography) objForUpdate.biography = biography;
        if(date_of_birth) objForUpdate.dateOfBirth = date_of_birth;
        if(phone_number) objForUpdate.phoneNumber = phone_number;

        if(state || city || district || street || number) {
            objForUpdate.address = {};
            objForUpdate.address.coordinates = {};

            if(state) objForUpdate.address.state = state;
            if(city) objForUpdate.address.city = city;
            if(district) objForUpdate.address.district = district;
            if(street) objForUpdate.address.street = street;
            if(number) objForUpdate.address.number = number;

            try {
                const { lat, lon } = await Nominatim.geosearch_structuredData({ state, city, district, street, number })
                .then((result) => {
                    return result.coordinates;
                });

                objForUpdate.address.coordinates.lat = lat;
                objForUpdate.address.coordinates.lon = lon;

                const profissionalProfileUpdated = await ProfessionalProfile.findOneAndUpdate({ userId }, objForUpdate, { new: true });

                return res.json(profissionalProfileUpdated);
            } catch(err) {
                return res.json({ code: 404, error: err });
            }
        }
    }).catch((err) => {
        return res.json({ code: 403, error: err });
    });
}

const remove = async (req, res) => {
    const { authentication } = req.headers;

    const { id:userId } = await Authenticator.decode(authentication);
    
    await ProfessionalProfile.deleteOne({ userId });

    // ProfissionalProfile.removeProfessionalProfile(userId);

    return res.json();
}

const like = async(req, res) => {
    const { authentication, professional_profile_id } = req.headers;
    const { id:userId } = await Authenticator.decode(authentication);

    const professionalProfile = await ProfessionalProfile.findOne({ _id:professional_profile_id });

    if(professionalProfile) {
        if(!professionalProfile.likes.includes(userId))
            professionalProfile.likes.push(userId);
        else {
            for(var i=0; professionalProfile.likes.length > i; i++) {
                if(professionalProfile.likes[i] == userId) {
                    professionalProfile.likes.splice(i, 1);
                    break;
                }
            }
        }
    
        professionalProfile.save();
    }

    return res.json(professionalProfile);
}

const liked = async(req, res) => {
    // const { authentication, professional_profile_id } = req.headers;
    // const { id:userId } = await Authenticator.decode(authentication);

    // console.log(`${userId} - ${professional_profile_id}`);

    // const verify = await FreelanceWork.findOne({ _id: professional_profile_id, likes: userId });
    
    return res.json({ ok:true });

    // if(verify)
    //     return true;
    // else
    //     return false;
}

const checkIfHaveProfessionalProfile = async (authentication) => {
    const professionalProfile = await getProfessionalProfile(authentication);

    if(!professionalProfile)
        throw 'You do not have a professional profile yet.'
    
    return professionalProfile;
}

const getProfessionalProfile = async (authentication) => {
    const { id:userId } = await Authenticator.decode(authentication);

    const profissionalProfile = await ProfessionalProfile.findOne({
        userId
    });

    return profissionalProfile;
}

module.exports = {
    getProfessionalProfile,
    checkIfHaveProfessionalProfile,

    index,
    get,
    getByUser,
    myProfessionalProfile,
    store,
    update,
    remove,
    like,
    liked
}