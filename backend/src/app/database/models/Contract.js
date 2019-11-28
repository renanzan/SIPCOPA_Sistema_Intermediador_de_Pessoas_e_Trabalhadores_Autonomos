const { Schema, model } = require('mongoose');

const possibilityOfStatus = [
    'pending',
    'refused',
    'open',
    'close',
    'rated'
]

const paymentMethodPossibilities = [
    'bitpoints',
    'credit',
    'debit'
]

const ContractSchema = new Schema({
    employer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    employee: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ProfissionalProfile'
    },
    job: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'FreelanceWork'
    },
    price: {
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    form_of_payment: {
        type: String,
        required: true,
        enum: paymentMethodPossibilities,
        default: paymentMethodPossibilities[0]
    },
    status: {
        type: String,
        required: true,
        default: possibilityOfStatus[0],
        enum: possibilityOfStatus
    },
    rate: {
        type: Schema.Types.Decimal128
    },
    comment: {
        type: String
    }
}, { timestamps: true });

module.exports = model('Contract', ContractSchema);