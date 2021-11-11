const express = require("express");
const golonganModel = require("../models/golongan");
const router = express.Router();
const auth = require("../middleware/auth");

// get all data golongan
router.get("/", auth, async (req, res) => {
  const data = await golonganModel.find();

  res.send(data);
});

// save data golongan
router.post("/", auth, async (req, res) => {
  const { golongan, pangkat } = req.body;

  const users = new golonganModel({
    golongan,
    pangkat,
  });

  users.save((err, doc) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Data golongan berhasil disimpan",
      id: doc._id,
    });
  });
});

// ubah data golongan
router.put("/", auth, async (req, res) => {
  const { _id, nik, nama, username, password, images } = req.body;

  const newData = { nik, nama, username, password, images };

  golonganModel.findByIdAndUpdate(
    _id,
    newData,
    { useFindAndModify: false },
    (err) => {
      if (err) return res.status(500).send({ message: err });

      res.status(200).send({
        message: "golongan berhasil diubah",
      });
    }
  );
});

// hapus data golongan
router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(404).send({ message: "ID tidak ditemukan" });
  }

  golonganModel.deleteOne({ _id }, (err) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "golongan berhasil dihapus",
    });
  });
});

module.exports = router;
