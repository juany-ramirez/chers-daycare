const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cj = require("./cronjobs");
var CronJob = require("cron").CronJob;
require("dotenv/config");

//Import Routes

//*Middleware
app.use(bodyParser.json());
app.use(cors());
//**MyRoutes
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));
app.use("/api/admins", require("./routes/administrators"));
app.use("/api/caretakers", require("./routes/caretakers"));
app.use("/api/kids", require("./routes/kids"));
app.use("/api/parents", require("./routes/parents"));
app.use("/api/auth", require("./routes/authentications"));
app.use("/api/payment", require("./routes/payments"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log("Connected to db");
});

// "0 4 1-28 * *"
new CronJob(
  "0 4 1-28 * *",
  () => {
    cj.createCronJob();
  },
  null,
  true,
  "America/Los_Angeles"
);

app.listen(process.env.PORT || 4000);
