const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const URI = process.env.MONGODB_URI || "mongodb://user:password1@ds157325.mlab.com:57325/heroku_dj14n95j"

mongoose.connect(URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});


app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

