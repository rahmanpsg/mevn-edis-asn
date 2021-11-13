const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    permohonan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permohonan",
    },
    status: Boolean,
    keterangan: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Verifikator",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verifikasi", schema);
