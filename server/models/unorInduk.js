const mongoose = require("mongoose");

const schema = mongoose.Schema({
  nama: String,
});

module.exports = mongoose.model("UnorInduk", schema);
