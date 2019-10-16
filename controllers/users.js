
const User = require('../models/User');
const Administrator = require('../models/Administrator');
const Caretaker = require('../models/Caretaker');
const Parent = require('../models/Parent');

deleteUser = (req, res, rolUser) => {
    User.deleteOne({ _id: req.params.id }).then((user) => {
        user.rolUser = rolUser;
        res.send({ success: true, data: user });
    }).catch((err) => {
        res.status(422).send({ success: false, error: err.message });
    });
}

module.exports = {
    getUsers: async (req, res, next) => {
        User.find().then((users) => {
            res.send({ success: true, data: users });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    getUser: async (req, res, next) => {
        User.findById(req.params.id).then((user) => {
            res.send({ success: true, data: user });
        }).catch((err) =>
            res.status(422).send({ success: false, error: err.message })
        );
    },
    deleteUser: async (req, res, next) => {
        User.findById(req.params.id).then((user) => {
            if (user.rol === 1) {
                Administrator.deleteOne({ _id: user.user_type }).then((rolUser) => {
                    deleteUser(req, res, rolUser);
                }).catch((err) => {
                    res.status(422).send({ success: false, error: err.message });
                });
            } else if (user.rol === 2) {
                Caretaker.deleteOne({ _id: user.user_type }).then((rolUser) => {
                    deleteUser(req, res, rolUser);
                }).catch((err) => {
                    res.status(422).send({ success: false, error: err.message });
                });
            } else if (user.rol === 3) {
                Parent.deleteOne({ _id: user.user_type }).then((rolUser) => {
                    deleteUser(req, res, rolUser);
                }).catch((err) => {
                    res.status(422).send({ success: false, error: err.message });
                });
            }
        }).catch((err) => {
            res.status(422).send({ success: false, error: err.message });
        });
    },
}