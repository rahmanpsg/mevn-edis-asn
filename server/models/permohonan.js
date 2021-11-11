const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tanggal: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permohonan", schema);
