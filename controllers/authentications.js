const express = require("express");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Administrator = require("../models/Administrator");
const Caretaker = require("../models/Caretaker");
const Parent = require("../models/Parent");
const { JWT_SECRET } = require("../configuration");
const bcrypt = require("bcryptjs");

newRol = async (rol, user_id) => {
  let rol_user;
  if (rol === 1) {
    rol_user = new Administrator({ user_id });
    rol_user.save().then(rol => {
      return rol;
    });
  } else if (rol === 2) {
    rol_user = new Caretaker({ user_id });
    rol_user.save().then(rol => {
      return rol;
    });
  } else if (rol === 3) {
    rol_user = new Parent({ user_id });
    rol_user.save().then(rol => {
      return rol;
    });
  }
  return rol_user;
};

signToken = user => {
  return JWT.sign(
    {
      sub: user.id,
      exp: new Date().setDate(new Date().getDate() + 1),
      names: user.names,
      last_names: user.last_names,
      email: user.email,
      third_party_notification: user.third_party_notification,
      notifications: user.notifications,
      rol: user.rol
    },
    JWT_SECRET
  );
};

updateUser = (req, res, next) => {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.status(422).send({ success: false, error: err });
    user.names = req.body.names;
    user.last_names = req.body.last_names;
    user.email = req.body.email;
    user.password = req.body.password;
    user.phone = req.body.phone;
    user.third_party_notification = req.body.third_party_notification;
    user.notifications = [...req.body.notifications];
    user.rol = req.body.rol;
    user
      .save()
      .then(user => {
        res.send({ success: true, data: user });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  });
};

deleteRolUpdateNew = (req, res, next, user_id, rolUser) => {
  rolUser
    .deleteOne({ _id: user_id })
    .then(data => {
      newRol(req.body.rol, user_id)
        .then(newUser => {
          req.body.user_type = newUser._id;
          updateUser(req, res, next);
        })
        .catch(err => {
          res.status(422).send({ success: false, error: err.message });
        });
    })
    .catch(err => {
      res.status(422).send({ success: false, error: err.message });
    });
};

module.exports = {
  signUp: async (req, res, next) => {
    const user = new User({
      names: req.body.names,
      last_names: req.body.last_names,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      third_party_notification: req.body.third_party_notification,
      notifications: [...req.body.notifications],
      rol: req.body.rol
    });
    let rol_type = await newRol(req.body.rol, user._id);

    user.user_type = rol_type._id;

    user
      .save()
      .then(user => {
        res.send({ success: true, data: user });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ success: true, token });
  },
  secret: async (req, res, next) => {
    res.send({ success: true, response: "response" });
  },
  updateUser: async (req, res, next) => {
    User.findById(req.params.id)
      .then(user => {
        if (req.body.rol != user.rol) {
          if (user.rol === 1) {
            deleteRolUpdateNew(req, res, next, user.user_type, Administrator);
          } else if (user.rol === 2) {
            deleteRolUpdateNew(req, res, next, user.user_type, Caretaker);
          } else if (user.rol === 3) {
            deleteRolUpdateNew(req, res, next, user.user_type, Parent);
          }
        } else {
          updateUser(req, res, next);
        }
      })
      .catch(err => {
        res.status(422).send({ success: false, error: err.message });
      });
  }
};
