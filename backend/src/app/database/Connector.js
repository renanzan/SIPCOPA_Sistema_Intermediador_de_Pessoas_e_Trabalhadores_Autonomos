const mongoose = require('mongoose');

const MONGO_USERNAME = 'omnistack';
const MONGO_PASSWORD = 'omnistack';
const MONGO_DATABASE_NAME = 'tabalho_economia';

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0-5u5lx.mongodb.net/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`;

const OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
};

module.exports = () => {
    mongoose.connect(MONGO_URL, OPTIONS).then(() => {
        console.log('Connected to Database successfully!');
    }).catch((err) => {
        console.log(err);
    });
};