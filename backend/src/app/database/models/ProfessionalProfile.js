const { Schema, model, Types } = require('mongoose');
const FreelanceWork = require('./FreelanceWork');

const CoordinatesSchema = new Schema({
    lat: {
        type: String
    },
    lon: {
        type: String
    }
}, { _id: false });

const AddressSchema = new Schema({
    state: {
        type: String
    },
    city: {
        type: String
    },
    district: {
        type: String
    },
    street: {
        type: String
    },
    number: {
        type: String
    },
    coordinates: CoordinatesSchema
}, { _id: false });

const ProfissionalProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        select: false,
        index: true,
        ref: 'User'
    },
    likes: [{
        type: Schema.Types.ObjectId
    }],
    urlPhoto: {
        type: String
    },
    fullName: {
        type: String,
        required: true
    },
    biography: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: AddressSchema,
    __v: {
        type: Number,
        select: false
    }
});

ProfissionalProfileSchema.pre('deleteOne', { document: true }, async function (next) {
    console.log('deleting...');
    const { userId } = this._conditions;

    const ProfissionalProfile = model('ProfissionalProfile', ProfissionalProfileSchema);

    const { _id } = await ProfissionalProfile.findOne({ userId });

    FreelanceWork.deleteMany({ professionalProfileId: _id });

    next();
});

module.exports = model('ProfissionalProfile', ProfissionalProfileSchema);