const Parent = require("../models/Parent");

module.exports = {
  getPayments: async (req, res, next) => {
    Parent.aggregate([
      {
        $lookup: {
          from: "kids",
          localField: "kids",
          foreignField: "_id",
          as: "kids"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          payments: 1,
          kids: "$kids",
          charge: {$sum: ["$kids.charge"]},
          user: {
            names: "$user.names",
            last_names: "$user.last_names",
            phone: "$user.phone"
          }
        }
      }
    ])
      .then(parents => {
        res.send({ success: true, data: parents });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  }
};
