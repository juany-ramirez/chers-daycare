const Parent = require("../models/Parent");

module.exports = {
  getParents: async (req, res, next) => {
    Parent.find(req.query)
      .then(parents => {
        res.send({ success: true, data: parents });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  getParent: async (req, res, next) => {
    Parent.findById(req.params.id)
      .then(parent => {
        res.send({ success: true, data: parent });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  createParent: async (req, res, next) => {
    const parent = new Parent({
      user_id: req.body.user_id,
      kids: req.body.kids ? [...req.body.kids] : req.body.kids,
      notifications: req.body.notifications
        ? [...req.body.notifications]
        : req.body.notifications,
      payments: req.body.payments ? [...req.body.payments] : []
    });
    parent
      .save()
      .then(parent => {
        res.send({ success: true, data: parent });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  deleteParent: async (req, res, next) => {
    Parent.deleteOne({ _id: req.params.id })
      .then(parent => {
        res.send({ success: true, data: parent });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  updateParent: async (req, res, next) => {
    Parent.updateOne(
      { _id: req.params.id },
      {
        $set: {
          user_id: req.body.user_id,
          kids: req.body.kids ? [...req.body.kids] : req.body.kids,
          notifications: req.body.notifications
            ? [...req.body.notifications]
            : req.body.notifications,
          payments: req.body.payments
            ? [...req.body.payments]
            : req.body.payments
        }
      }
    )
      .then(parent => {
        res.send({ success: true, data: parent });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  kidControl: async (req, res, next) => {
    Parent.findOne({ _id: req.params.id })
      .then(parent => {
        let kidIndex = parent.kids.indexOf(req.body.kid_id);
        if (kidIndex != -1) {
          parent.kids.splice(kidIndex, 1);
        } else {
          parent.kids.push(req.body.kid_id);
        }
        parent
          .save()
          .then(newParent => {
            res.send({ success: true, data: newParent });
          })
          .catch(err =>
            res.status(422).send({ success: false, error: err.message })
          );
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  }
};
