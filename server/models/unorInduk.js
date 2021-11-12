const mongoose = require("mongoose");

const schema = mongoose.Schema({
  unor_induk: String,
});

module.exports = mongoose.model("UnorInduk", schema);
