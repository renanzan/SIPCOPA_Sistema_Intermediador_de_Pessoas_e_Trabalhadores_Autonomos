const { Schema, model } = require('mongoose');

const { service_possibilities } = require('../../../config/app');

const ContractInfoSchema = new Schema({
    contractor_user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    hired_professional_profile_id: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, { _id: false });

const JobSchema = new Schema({
    job_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    job: {
        type: String,
        required: true,
        enum: service_possibilities
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const HireSchema = new Schema({
    job: JobSchema,
    contract_info: ContractInfoSchema,
    contract_conclusion: {
        accept: {
            type: Boolean,
            default: false
        },
        rate: {
            type: Schema.Types.Decimal128,
            default: null
        },
        contractor_comment: {
            type: String,
            default: null
        },
        hired_comment: {
            type: String,
            default: null
        }
    }
}, { timestamps: true });

module.exports = model('Hire', HireSchema);