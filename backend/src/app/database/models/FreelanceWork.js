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
            '1_star': {
            type: Number,
            default: 0
        },
        '2_star': {
            type: Number,
            default: 0
        },
        '3_star': {
            type: Number,
            default: 0
        },
        '4_star': {
            type: Number,
            default: 0
        },
        '5_star': {
            type: Number,
            default: 0
        }
    },
    rate_weighted_average: {
        type: Schema.Types.Decimal128,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
});

FreelanceWorkSchema.pre('save', { document: true }, async function (next) {
    const job = this;

    const weighted_average = (
        (job.rate['1_star'] * 1) +
        (job.rate['2_star'] * 2) +
        (job.rate['3_star'] * 3) +
        (job.rate['4_star'] * 4) +
        (job.rate['5_star'] * 5)
    ) / (
        job.rate['1_star'] +
        job.rate['2_star'] +
        job.rate['3_star'] +
        job.rate['4_star'] +
        job.rate['5_star']
    );

    if(!weighted_average)
        job.rate_weighted_average = parseFloat(0);
    else
        job.rate_weighted_average = parseFloat(weighted_average.toFixed(2));

    return next();
});

module.exports = model('FreelanceWork', FreelanceWorkSchema);