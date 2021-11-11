require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment");

const app = express();

moment.locale("id");

// app.use(express.json());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(cors());

const loginRoute = require("./routes/login");
const golonganRoute = require("./routes/golongan");

app.use(express.static("./dist/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname, "./dist/index.html");
});

app.use("/login", loginRoute);
app.use("/golongan", golonganRoute);

module.exports = app;
