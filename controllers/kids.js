const Kid = require('../models/Kid');
const Parent = require('../models/Parent');

module.exports = {
    getKids: async (req, res, next) => {
        Kid.find().then((kids) => {
            res.send({ success: true, data: kids });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    getKid: async (req, res, next) => {
        Kid.findById(req.params.id).then((kid) => {
            res.send({ success: true, data: kid });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    createKid: async (req, res, next) => {
        const kid = new Kid({
            names: req.body.names,
            last_names: req.body.last_names,
            profiles: req.body.profiles,
            tags: req.body.tags,
            monthly_payment: req.body.monthly_payment,
            singular_payment: req.body.singular_payment,
            parent: req.body.parent
        });
        kid.save().then((kid) => {
            Parent.findOne({ _id: req.body.parent }).then((parent) => {
                parent.kids.push(kid._id);
                parent.save().catch((err) =>
                    res.status(422).send({ success: false, error: err.message })
                );
            }).catch((err) =>
                res.status(404).send({ success: false, error: err.message })
            );
            res.send({ success: true, data: kid });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    deleteKid: async (req, res, next) => {
        Kid.findOne({ _id: req.params.id }).then((kid) => {
            Parent.findOne({ _id: kid.parent }).then((parent) => {
                parent.kids = parent.kids.filter((value) => {
                    return value != req.params.id;
                });
                parent.save().catch((err) =>
                    res.status(422).send({ success: false, error: err.message })
                );
            }).catch((err) =>
                res.status(404).send({ success: false, error: err.message })
            );
        }).catch((err) =>
            res.status(404).send({ success: false, error: err.message })
        );
        Kid.deleteOne({ _id: req.params.id }).then((kid) => {
            res.send({ success: true, data: kid });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    updateKid: async (req, res, next) => {
        Kid.updateOne({ _id: req.params.id },
            {
                $set:
                {
                    names: req.body.names,
                    last_names: req.body.last_names,
                    profiles: req.body.profiles,
                    tags: req.body.tags,
                    monthly_payment: req.body.monthly_payment,
                    singular_payment: req.body.singular_payment,
                    parent: req.body.parent
                }
            }).then((kid) => {
                res.send({ success: true, data: kid });
            }).catch((err) =>
                res.status(422).send({ success: false, error: err.message })
            );
    }
}