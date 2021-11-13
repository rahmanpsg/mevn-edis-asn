const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    pegawai: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    jenis: String,
    tanggal: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permohonan", schema);
