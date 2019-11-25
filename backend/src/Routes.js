const express = require('express');

const AuthController = require('./app/controllers/AuthController');
const UserController = require('./app/controllers/UserController');
const ProfessionalProfileController = require('./app/controllers/ProfessionalProfileController');
const FreelanceWorkController = require('./app/controllers/FreelanceWorkController');
const HireController = require('./app/controllers/HireController');
const ContractController = require('./app/controllers/ContractController');

const routes = express.Router();

routes.get('/get_job_option', (req, res) => {
    const { service_possibilities } = require('./config/app.json');

    return res.json(service_possibilities);
});

routes.post('/auth', AuthController.authenticate);
routes.post('/auth/register', AuthController.register);
routes.post('/auth/profile', AuthController.index);
routes.post('/auth/forgot_password', AuthController.forgotPssword);
routes.post('/auth/reset_password', AuthController.resetPassword);

routes.post('/professional_profile', ProfessionalProfileController.index);
routes.post('/professional_profile/my', ProfessionalProfileController.myProfessionalProfile);
routes.post('/professional_profile/new', ProfessionalProfileController.store);
routes.post('/professional_profile/update', ProfessionalProfileController.update);
routes.post('/professional_profile/remove', ProfessionalProfileController.remove);

routes.post('/service', FreelanceWorkController.index);
routes.post('/job/new', FreelanceWorkController.store);
routes.post('/job/show', FreelanceWorkController.show);
routes.post('/job/suggest_price', FreelanceWorkController.getMarketStatistics);

routes.post('/job/hire', HireController.store);
routes.post('/hires', HireController.showMyHires);

routes.post('/contract/new', ContractController.store);

routes.post('/bitpoint_recharge', UserController.bitpointRechargestore);

module.exports = routes;