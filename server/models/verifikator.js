const mongoose = require("mongoose");

const schema = mongoose.Schema({
  pegawai: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  level: { type: String, unique: true },
});

module.exports = mongoose.model("Verifikator", schema);
