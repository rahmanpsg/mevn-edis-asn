const express = require("express");
const userModel = require("../models/user");
const permohonanModel = require("../models/permohonan");
const verifikasiModel = require("../models/verifikasi");
const router = express.Router();
const auth = require("../middleware/auth");

// get total data
router.get("/", auth, async (req, res) => {
  const totalPegawai = await userModel.countDocuments({ role: "pegawai" });

  const verifikasis = await verifikasiModel.aggregate([
    {
      $group: {
        _id: "$permohonan",
        status: { $push: "$status" },
      },
    },
  ]);

  const totalPermohonan = await permohonanModel.countDocuments();
  const totalPermohonanDiproses = verifikasis
    .map((verif) => verif.status.length < 4 && verif.status.every(Boolean))
    .filter(Boolean).length;
  const totalPermohonanDiterima =
    totalPermohonan -
    verifikasis
      .map((verif) => verif.status.length >= 4 && verif.status.every(Boolean))
      .filter(Boolean).length;
  const totalPermohonanDitolak =
    totalPermohonan - (totalPermohonanDiproses + totalPermohonanDiterima);

  res.send({
    totalPegawai,
    totalPermohonan,
    totalPermohonanDiproses,
    totalPermohonanDiterima,
    totalPermohonanDitolak,
  });
});

module.exports = router;
