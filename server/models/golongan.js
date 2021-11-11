const mongoose = require("mongoose");

const schema = mongoose.Schema({
  golongan: String,
  pangkat: String,
});

module.exports = mongoose.model("Golongan", schema);
