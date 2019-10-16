const Administrator = require('../models/Administrator');

module.exports = {
    getAdministrators: async (req, res, next) => {
        Administrator.find().then((administrators) => {
            res.send({ success: true, data: administrators });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    getAdministrator: async (req, res, next) => {
        Administrator.findById(req.params.id).then((administrator) => {
            res.send({ success: true, data: administrator });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    createAdministrator: async (req, res, next) => {
        const administrator = new Administrator({
            user_id: req.body.user_id,
            courses: req.body.courses,
            posted_publications: req.body.posted_publications
        });
        administrator.save().then((administrator) => {
            res.send({ success: true, data: administrator });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    deleteAdministrator: async (req, res, next) => {
        Administrator.deleteOne({ _id: req.params.id }).then((administrator) => {
            res.send({ success: true, data: administrator });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    updateAdministrator: async (req, res, next) => {
        Administrator.updateOne({ _id: req.params.id },
            {
                $set:
                {
                    user_id: req.body.user_id,
                    courses: req.body.courses,
                    posted_publications: req.body.posted_publications
                }
            }).then((administrator) => {
                res.send({ success: true, data: administrator });
            }).catch((err) =>
                res.status(422).send({ success: false, error: err.message })
            );
    }
}