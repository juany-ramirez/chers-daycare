const Parent = require('../models/Parent');

module.exports = {
    getParents: async (req, res, next) => {
        Parent.find().then((parents) => {
            res.send({ success: true, data: parents });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    getParent: async (req, res, next) => {
        Parent.findById(req.params.id).then((parent) => {
            res.send({ success: true, data: parent });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    createParent: async (req, res, next) => {
        const parent = new Parent({
            user_id: req.body.user_id,
            kids: req.body.kids,
            notifications: req.body.notifications
        });
        parent.save().then((parent) => {
            res.send({ success: true, data: parent });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    deleteParent: async (req, res, next) => {
        Parent.deleteOne({ _id: req.params.id }).then((parent) => {
            res.send({ success: true, data: parent });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    updateParent: async (req, res, next) => {
        Parent.updateOne({ _id: req.params.id },
            {
                $set:
                {
                    user_id: req.body.user_id,
                    kids: req.body.kids,
                    notifications: req.body.notifications
                }
            }).then((parent) => {
                res.send({ success: true, data: parent });
            }).catch((err) =>
                res.status(422).send({ success: false, error: err.message })
            );
    }
}