const FreelanceWork = require('../database/models/FreelanceWork');
const ProfessionalProfile = require('../database/models/ProfessionalProfile');
const User = require('../database/models/User');

const { checkIfHaveProfessionalProfile } = require('./ProfessionalProfileController');
const { service_possibilities } = require('../../config/app');

module.exports = {
    async store(req, res) {
        const { authentication } = req.headers;
        const { job, description, price } = req.body;

        await checkIfHaveProfessionalProfile(authentication).then(async (response) => {
            const { _id: professionalProfileId } = response;

            const freelanceWork = await FreelanceWork.create({
                professionalProfileId,
                job,
                description,
                price
            });

            return res.json(freelanceWork);
        })
        .catch((err) => {
            return res.json(err);
        });
    },

    async index(req, res) {
        const perPage = (req.headers.perpage >= 1 && req.headers.perpage < 25) ? req.headers.perpage : 10;
        const page = (req.query.page >= 1) ? req.query.page : 1;
        const { filter, sort_by } = req.body;

        const jobs = await FreelanceWork.find(filter)
           .select('+professionalProfileId')
           .limit(parseInt(perPage))
           .skip(parseInt(perPage) * parseInt(page - 1))
           .sort(sort_by)
           .exec();

        if(jobs.length > 0) {
            var biggest_price, biggest_rate, smaller_price, smaller_rate;

            Promise.all([
                await FreelanceWork.findOne(filter, {}, { sort: { 'price' : -1 } }, function(err, job) {
                    biggest_price = job.price;
                }),

                await FreelanceWork.findOne(filter, {}, { sort: { 'price' : 1 } }, function(err, job) {
                    smaller_price = job.price;
                }),

                await FreelanceWork.findOne(filter, {}, { sort: { 'rate' : -1 } }, function(err, job) {
                    biggest_rate = job.rate;
                }),

                await FreelanceWork.findOne(filter, {}, { sort: { 'rate' : 1 } }, function(err, job) {
                    smaller_rate = job.rate;
                })
            ]);

            for(var count = 0; count < jobs.length; count++) {
                const { userId, urlPhoto, likes, fullName } = await ProfessionalProfile.findOne({ _id: jobs[count].professionalProfileId }).select('+userId');
                jobs[count] = { user_info: { userId, urlPhoto, likes, fullName }, ...jobs[count]._doc };
                delete jobs[count].__v;
                delete jobs[count].professionalProfileId;
            }

            FreelanceWork.countDocuments(filter).exec(function(err, count) {
                return res.json({
                    jobs,
                    extremes: {
                        price: [smaller_price, biggest_price],
                        rate: [smaller_rate, biggest_rate]
                    },
                    page: parseInt(page),
                    perpage: parseInt(perPage),
                    results: count,
                    pages: Math.ceil(count / parseInt(perPage))
                });
            });
        } else {
            return res.json({
                jobs,
                page: parseInt(page),
                perpage: parseInt(perPage),
                results: count
            });
        }
    },

    async getMarketStatistics(req, res) {
        if(!req.body.job)
            return res.json({ code: 404, error: 'Falta parâmetros no header.' });

        const { job } = req.body;

        if(!service_possibilities.includes(job.toString()))
            return res.json({ code: 403, error: 'O parâmetro job não é uma opção válida.' });

        const rate_range = ['0:1', '1:2', '2:3', '3:4', '4:5'];
        const smaller_price = [], biggest_price = [], average = [], occurrences = [];
        
        Promise.all([
            await FreelanceWork.findOne({ job, rate: { '$gte': 0, '$lt': 1 } }, {}, { sort: { 'price' : 1 } }, function(err, job) {
                (job) ? smaller_price.push(job.price) : smaller_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 0, '$lt': 1 } }, {}, { sort: { 'price' : -1 } }, function(err, job) {
                (job) ? biggest_price.push(job.price) : biggest_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 1, '$lt': 2 } }, {}, { sort: { 'price' : 1 } }, function(err, job) {
                (job) ? smaller_price.push(job.price) : smaller_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 1, '$lt': 2 } }, {}, { sort: { 'price' : -1 } }, function(err, job) {
                (job) ? biggest_price.push(job.price) : biggest_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 2, '$lt': 3 } }, {}, { sort: { 'price' : 1 } }, function(err, job) {
                (job) ? smaller_price.push(job.price) : smaller_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 2, '$lt': 3 } }, {}, { sort: { 'price' : -1 } }, function(err, job) {
                (job) ? biggest_price.push(job.price) : biggest_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 3, '$lt': 4 } }, {}, { sort: { 'price' : 1 } }, function(err, job) {
                (job) ? smaller_price.push(job.price) : smaller_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 3, '$lt': 4 } }, {}, { sort: { 'price' : -1 } }, function(err, job) {
                (job) ? biggest_price.push(job.price) : biggest_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 4, '$lte': 5 } }, {}, { sort: { 'price' : 1 } }, function(err, job) {
                (job) ? smaller_price.push(job.price) : smaller_price.push(-1);
            }),

            await FreelanceWork.findOne({ job, rate: { '$gte': 4, '$lte': 5 } }, {}, { sort: { 'price' : -1 } }, function(err, job) {
                (job) ? biggest_price.push(job.price) : biggest_price.push(-1);
            }),

            await FreelanceWork.find({ job, rate: { '$gte': 0, '$lt': 1 } }).count(function(err, count) {
                occurrences.push(count);
            }),

            await FreelanceWork.find({ job, rate: { '$gte': 1, '$lt': 2 } }).count(function(err, count) {
                occurrences.push(count);
            }),

            await FreelanceWork.find({ job, rate: { '$gte': 2, '$lt': 3 } }).count(function(err, count) {
                occurrences.push(count);
            }),

            await FreelanceWork.find({ job, rate: { '$gte': 3, '$lt': 4 } }).count(function(err, count) {
                occurrences.push(count);
            }),

            await FreelanceWork.find({ job, rate: { '$gte': 4, '$lt': 5 } }).count(function(err, count) {
                occurrences.push(count);
            })
        ]);

        for(var count=0; count<rate_range.length; count++)
            if(smaller_price[count] != -1 && biggest_price[count] != -1)
                average.push(Math.ceil((smaller_price[count] + biggest_price[count]) / 2));
            else
                average.push(-1);

        return res.json({
            job,
            price_by_rate: {
                rate_range,
                smaller_price,
                biggest_price,
                average,
                occurrences
            }
        });
    }
}