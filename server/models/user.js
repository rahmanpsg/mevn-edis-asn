const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    username: String,
    password: String,
    nip: String,
    nama: String,
    gelar_depan: String,
    gelar_belakang: String,
    golongan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Golongan",
    },
    jabatan: String,
    unor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unor",
    },
    image: String,
    role: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);
