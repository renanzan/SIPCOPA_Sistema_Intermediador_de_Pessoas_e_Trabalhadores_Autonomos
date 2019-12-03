const UserImage = require('../database/models/UserImage');
const Authenticator = require('../../app/util/Authenticator');
const fs = require('fs');

module.exports = {
    async uploadImage(req, res) {
        const { file, type, name, size } = req.body;

        const uploadedImage = await UserImage.create({
            img: file,
            type,
            name,
            size
        });

        return res.json(uploadedImage);
    },

    async getImage(req, res) {
        const { image_id:_id } = req.headers;

        const image = await UserImage.findOne({ _id });

        return res.json(image);
    }
}