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
const pegawaiRoute = require("./routes/pegawai");
const verifikatorRoute = require("./routes/verifikator");
const pelanggaranRoute = require("./routes/pelanggaran");
const golonganRoute = require("./routes/golongan");
const unorRoute = require("./routes/unor");

app.use(express.static("./dist/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname, "./dist/index.html");
});

app.use("/login", loginRoute);
app.use("/pegawai", pegawaiRoute);
app.use("/verifikator", verifikatorRoute);
app.use("/pelanggaran", pelanggaranRoute);
app.use("/golongan", golonganRoute);
app.use("/unor", unorRoute);

module.exports = app;
