const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    keterangan: String,
    tanggal: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pelanggaran", schema);
