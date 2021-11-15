const moment = require("moment");
const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    pegawai: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    jenis: String,
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  const { pegawai, jenis } = this;

  const pelanggaran = await mongoose
    .model("Pelanggaran")
    .findOne({ pegawai, jenis }, "tanggal")
    .sort({ tanggal: -1 });

  if (pelanggaran != null) {
    if (jenis == "disiplin") {
      const tanggal = moment(pelanggaran.tanggal).add(1, "y");
      if (tanggal.isSameOrAfter(moment())) {
        next(
          new Error(
            `Anda memiliki pelanggaran disiplin pada tanggal ${tanggal.format(
              "LL"
            )}, berlaku ${tanggal.fromNow()}`
          )
        );
      }
    } else if (jenis == "pidana") {
      next(new Error("Anda memiliki pelanggaran pidana"));
    }
  }

  next();
});

schema.pre("deleteMany", async function (next) {
  const verifikasis = mongoose.model("Verifikasi");

  const permohonans = await mongoose
    .model("Permohonan")
    .find(this.getQuery(), "id");

  verifikasis.deleteMany({ permohonan: { $in: permohonans } }, (err) => {
    if (err) next(err);
    next();
  });
});

module.exports = mongoose.model("Permohonan", schema);
