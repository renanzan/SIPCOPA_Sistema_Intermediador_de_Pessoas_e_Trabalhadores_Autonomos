const { Schema, model } = require('mongoose');
const crypto = require('crypto');

const UserImageSchema = new Schema({
    img: {
        type: Buffer,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('UserImage', UserImageSchema);