const express = require("express");
const unorModel = require("../models/unor");
const unorIndukModel = require("../models/unorInduk");
const router = express.Router();
const auth = require("../middleware/auth");

// get all data unor
router.get("/", auth, async (req, res) => {
  const { select } = req.query;

  if (select == null) {
    const unor_induk = await unorIndukModel.find();
    const unor = await unorModel.find();

    res.send({ unor_induk, unor });
  } else if (select == "list") {
    const unors = await unorModel
      .find()
      .populate("unor_induk", "unor_induk")
      .sort("unor_induk");

    const unorsMap = unors.map((unor) => {
      return {
        _id: unor._id,
        induk: unor.unor_induk.unor_induk,
        nama: unor.nama,
      };
    });

    const unorsList = [];
    let prevHeader = null;

    for (const unor of unorsMap) {
      if (prevHeader != unor.induk) {
        if (prevHeader != null) unorsList.push({ divider: true });
        unorsList.push({ header: unor.induk });
        prevHeader = unor.induk;
      }
      unorsList.push(unor);
    }

    res.send(unorsList);
  }
});

// save data unor induk
router.post("/", auth, async (req, res) => {
  const { unor_induk } = req.body;

  const unorInduks = new unorIndukModel({
    unor_induk,
  });

  unorInduks.save((err, doc) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Unit Organisasi Induk berhasil disimpan",
      id: doc._id,
    });
  });
});

// save data unor
router.post("/:idUnorInduk", auth, async (req, res) => {
  const { nama, unor_induk } = req.body;

  const unors = new unorModel({
    nama,
    unor_induk,
  });

  unors.save((err, doc) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Unit Organisasi berhasil disimpan",
      id: doc._id,
    });
  });
});

// ubah data unor induk
router.put("/", auth, async (req, res) => {
  const { _id, unor_induk } = req.body;

  const newData = {
    unor_induk,
  };

  unorIndukModel.findByIdAndUpdate(
    _id,
    newData,
    { useFindAndModify: false },
    (err) => {
      if (err) return res.status(500).send({ message: err });

      res.status(200).send({
        message: "Unit Organisasi Induk berhasil diubah",
      });
    }
  );
});

// ubah data unor
router.put("/:idUnorInduk", auth, async (req, res) => {
  const { _id, nama, unor_induk } = req.body;

  const newData = {
    nama,
    unor_induk,
  };

  unorModel.findByIdAndUpdate(
    _id,
    newData,
    { useFindAndModify: false },
    (err) => {
      if (err) return res.status(500).send({ message: err });

      res.status(200).send({
        message: "Unit Organisasi berhasil diubah",
      });
    }
  );
});

// hapus data unor induk
router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(404).send({ message: "ID tidak ditemukan" });
  }

  unorIndukModel.deleteOne({ _id }, (err) => {
    if (err) return res.status(500).send({ message: err });

    unorModel.deleteMany({ unor_induk: _id }, (e) => {
      if (e) return res.status(500).send({ message: err });

      res.status(200).send({
        message: "Unit Organisasi Induk berhasil dihapus",
      });
    });
  });
});

// hapus data unor
router.delete("/:id/:unor", auth, async (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(404).send({ message: "ID tidak ditemukan" });
  }

  unorModel.deleteOne({ _id }, (err) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Unit Organisasi berhasil dihapus",
    });
  });
});

module.exports = router;
