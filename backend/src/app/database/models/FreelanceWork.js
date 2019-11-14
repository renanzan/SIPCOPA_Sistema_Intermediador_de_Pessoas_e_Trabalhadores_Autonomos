const { Schema, model } = require('mongoose');

const { service_possibilities } = require('../../../config/app');

const FreelanceWorkSchema = new Schema({
    professionalProfileId: {
        type: Schema.Types.ObjectId,
        ref: 'ProfissionalProfile',
        select: false
    },
    job: {
        type: String,
        required: true,
        enum: service_possibilities
    },
    description: {
        type: String,
        required: true
    },
    rate: {
        type: Schema.Types.Decimal128,
        default: 2.3
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = model('FreelanceWork', FreelanceWorkSchema);