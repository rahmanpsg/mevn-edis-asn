const express = require("express");
const permohonanModel = require("../models/permohonan");
const verifikasiModel = require("../models/verifikasi");
const router = express.Router();
const auth = require("../middleware/auth");

// get all data permohonan
router.get("/", auth, async (req, res) => {
  const permohonans = await permohonanModel
    .find()
    .populate("pegawai", "nama gelar_depan gelar_belakang");

  const verifikasis = await verifikasiModel
    .find()
    .populate("verifiedBy", "level")
    .sort("tahap");

  const data = permohonans.map((per) => {
    const verif = verifikasis.filter((ver) => ver.permohonan == per._id);

    let status = [];
    let keterangan = "Menunggu Konfirmasi Tahap 1";

    if (verif != undefined) {
      status = verif.map((v) => v.status);
      if (status.every(Boolean)) {
        if (status.length < 4) {
          keterangan = `Menunggu Konfirmasi Tahap ${status.length + 1}`;
        } else {
          keterangan = "Permohonan Telah Selesai Di Verifikasi";
        }
      } else {
        keterangan =
          verif[verif.length - 1].keterangan ??
          `Ditolak Pada Tahap ${status.length}`;
      }
    }
    return { ...per._doc, status, keterangan };
  });

  res.send(data);
});

// save data permohonan
router.post("/", auth, async (req, res) => {
  const { pegawai, jenis } = req.body;

  const permohonans = new permohonanModel({
    pegawai,
    jenis,
  });

  permohonans.save((err, doc) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Data permohonan berhasil disimpan",
      id: doc._id,
    });
  });
});

// ubah data permohonan
router.put("/", auth, async (req, res) => {
  const { _id, pegawai, jenis, tanggal, keterangan } = req.body;

  const newData = { pegawai, jenis, tanggal, keterangan };

  permohonanModel.findByIdAndUpdate(
    _id,
    newData,
    { useFindAndModify: false },
    (err) => {
      if (err) return res.status(500).send({ message: err });

      res.status(200).send({
        message: "Permohonan berhasil diubah",
      });
    }
  );
});

// hapus data permohonan
router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(404).send({ message: "ID tidak ditemukan" });
  }

  permohonanModel.deleteOne({ _id }, (err) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Permohonan berhasil dihapus",
    });
  });
});

module.exports = router;
