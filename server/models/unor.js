const mongoose = require("mongoose");

const schema = mongoose.Schema({
  nama: String,
  unor_induk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UnorInduk",
  },
});

module.exports = mongoose.model("Unor", schema);
