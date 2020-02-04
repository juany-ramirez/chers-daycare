const User = require("../models/User");
const Administrator = require("../models/Administrator");
const Caretaker = require("../models/Caretaker");
const Parent = require("../models/Parent");

deleteUser = (req, res, rolUser) => {
  User.deleteOne({ _id: req.params.id })
    .then(user => {
      user.rolUser = rolUser;
      res.send({ success: true, data: user });
    })
    .catch(err => {
      res.status(422).send({ success: false, error: err.message });
    });
};

module.exports = {
  getUsers: async (req, res, next) => {
    User.find(req.query)
      .then(users => {
        res.send({ success: true, data: users });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  getUser: async (req, res, next) => {
    User.findById(req.params.id)
      .then(user => {
        res.send({ success: true, data: user });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  deleteUser: async (req, res, next) => {
    User.findById(req.params.id)
      .then(user => {
        if (user.rol === 1) {
          Administrator.deleteOne({ _id: user.user_type })
            .then(rolUser => {
              deleteUser(req, res, rolUser);
            })
            .catch(err => {
              res.status(422).send({ success: false, error: err.message });
            });
        } else if (user.rol === 2) {
          Caretaker.deleteOne({ _id: user.user_type })
            .then(rolUser => {
              deleteUser(req, res, rolUser);
            })
            .catch(err => {
              res.status(422).send({ success: false, error: err.message });
            });
        } else if (user.rol === 3) {
          Parent.deleteOne({ _id: user.user_type })
            .then(rolUser => {
              deleteUser(req, res, rolUser);
            })
            .catch(err => {
              res.status(422).send({ success: false, error: err.message });
            });
        }
      })
      .catch(err => {
        res.status(422).send({ success: false, error: err.message });
      });
  },
  createNotification: async (req, res, next) => {
    let query = { _id: req.params.userId };
    if (req.query.rol === "3") {
      query = { user_type: req.params.userId };
    }

    if (req.body.id_user === req.params.userId) {
      res.send({ success: true, data: {} });
    } else {
      const notification = {
        text: req.body.text,
        opened: req.body.opened,
        type: req.body.type,
        date: req.body.date,
        link: req.body.link
      };
      User.updateOne(
        query,
        { $addToSet: { notifications: notification } },
        function(error, success) {
          if (error) {
            res.status(404).send({ success: false, error: err.message });
          } else {
            res.send({ success: true, data: success });
          }
        }
      ).catch(err =>
        res.status(404).send({ success: false, error: err.message })
      );
    }
  },
  updateNotification: async (req, res, next) => {
    User.updateOne(
      { _id: req.params.userId, "notifications._id": req.params.id },
      { $set: { "notifications.$.opened" : true } },
      function(error, success) {
        if (error) {
          res.status(404).send({ success: false, error: err.message });
        } else {
          res.send({ success: true, data: success });
        }
      }
    ).catch(err =>
      res.status(404).send({ success: false, error: err.message })
    );
  }
};
