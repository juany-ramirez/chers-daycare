
const Caretaker = require('../models/Caretaker');

module.exports = {
    getCaretakers: async (req, res, next) => {
        Caretaker.find(req.query).then((caretakers) => {
            res.send({ success: true, data: caretakers });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    getCaretaker: async (req, res, next) => {
        Caretaker.findById(req.params.id).then((caretaker) => {
            res.send({ success: true, data: caretaker });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    createCaretaker: async (req, res, next) => {
        const caretaker = new Caretaker({
            user_id: req.body.user_id,
            courses: [...req.body.courses],
            posted_publications: [...req.body.posted_publications]
        });
        caretaker.save().then((caretaker) => {
            res.send({ success: true, data: caretaker });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    deleteCaretaker: async (req, res, next) => {
        Caretaker.deleteOne({ _id: req.params.id }).then((caretaker) => {
            res.send({ success: true, data: caretaker });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    updateCaretaker: async (req, res, next) => {
        Caretaker.updateOne({ _id: req.params.id },
            {
                $set:
                {
                    user_id: req.body.user_id,
                    courses: [...req.body.courses],
                    posted_publications: [...req.body.posted_publications]
                }
            }).then((caretaker) => {
                res.send({ success: true, data: caretaker });
            }).catch((err) =>
                res.status(422).send({ success: false, error: err.message })
            );
    }
}