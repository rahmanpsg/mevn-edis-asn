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

schema.pre("deleteOne", function (next) {
  const pelanggarans = mongoose.model("Pelanggaran");
  const permohonans = mongoose.model("Permohonan");

  const id = this.getQuery()["_id"];

  pelanggarans.deleteMany({ pegawai: id }, (err) => {
    if (err) next(err);
    next();
  });

  permohonans.deleteMany({ pegawai: id }, (err) => {
    if (err) next(err);
    next();
  });
});

module.exports = mongoose.model("User", schema);
