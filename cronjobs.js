const Kid = require("./models/Kid");
let moment = require("moment");

module.exports = {
  createCronJob: () => {
    let todayDay = moment().format("DD");
    Kid.find({
      monthly_payment: { $ne: null },
      "monthly_payment.due_date": todayDay
    })
      .then(kids => {
        kids.forEach(kid => {
          Kid.updateOne(
            { _id: kid._id },
            {
              $set: {
                latest_monthly_charge: Date.now(),
                done: false,
                charge: kid.charge + kid.monthly_payment.payment
              }
            }
          );
        });
      })
      .catch(err => {
        console.log("err", err);
      });
  }
};
