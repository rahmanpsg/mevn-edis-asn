const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    nip: String,
    nama: String,
    gelar_depan: String,
    gelar_belakang: String,
    username: String,
    password: String,
    golongan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Golongan",
    },
    unor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unor",
    },
    jabatan: String,
    role: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);
