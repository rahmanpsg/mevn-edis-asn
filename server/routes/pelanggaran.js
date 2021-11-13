const express = require("express");
const pelanggaranModel = require("../models/pelanggaran");
const router = express.Router();
const auth = require("../middleware/auth");

// get all data pelanggaran
router.get("/", auth, async (req, res) => {
  const data = await pelanggaranModel
    .find()
    .populate("pegawai", "nip nama gelar_depan gelar_belakang");

  res.send(data);
});

// save data pelanggaran
router.post("/", auth, async (req, res) => {
  const { pegawai, jenis, tanggal, keterangan } = req.body;

  const pelanggarans = new pelanggaranModel({
    pegawai,
    jenis,
    tanggal,
    keterangan,
  });

  pelanggarans.save((err, doc) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Data pelanggaran berhasil disimpan",
      id: doc._id,
    });
  });
});

// ubah data pelanggaran
router.put("/", auth, async (req, res) => {
  const { _id, pegawai, jenis, tanggal, keterangan } = req.body;

  const newData = { pegawai, jenis, tanggal, keterangan };

  pelanggaranModel.findByIdAndUpdate(
    _id,
    newData,
    { useFindAndModify: false },
    (err) => {
      if (err) return res.status(500).send({ message: err });

      res.status(200).send({
        message: "Pelanggaran berhasil diubah",
      });
    }
  );
});

// hapus data pelanggaran
router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(404).send({ message: "ID tidak ditemukan" });
  }

  pelanggaranModel.deleteOne({ _id }, (err) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Pelanggaran berhasil dihapus",
    });
  });
});

module.exports = router;
