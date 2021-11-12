const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    pegawai: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    jenis: String,
    tanggal: String,
    keterangan: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pelanggaran", schema);
