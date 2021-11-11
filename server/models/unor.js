const mongoose = require("mongoose");

const schema = mongoose.Schema({
  nama: String,
  intansi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UnorInduk",
  },
});

module.exports = mongoose.model("Unor", schema);
