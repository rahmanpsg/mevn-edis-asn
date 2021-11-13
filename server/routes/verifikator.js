const express = require("express");
const verifikatorModel = require("../models/verifikator");
const router = express.Router();
const auth = require("../middleware/auth");

// get all data verifikator
router.get("/", auth, async (req, res) => {
  const data = await verifikatorModel.find().populate("pegawai", "nip");

  res.send(data);
});

// save data verifikator
router.post("/", auth, async (req, res) => {
  const verifikators = req.body.verifikators.map(
    (v) => new verifikatorModel(v)
  );

  await verifikatorModel.deleteMany();

  verifikatorModel
    .insertMany(verifikators)
    .then((doc) => {
      res.status(200).send({
        message: "Data verifikator berhasil disimpan",
        id: doc._id,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err) return res.status(500).send({ message: err });
    });
});

// reset data verifikator
router.delete("/", auth, async (req, res) => {
  verifikatorModel
    .deleteMany()
    .then((doc) => {
      res.status(200).send({
        message: "Data verifikator berhasil direset",
        id: doc._id,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err) return res.status(500).send({ message: err });
    });
});

module.exports = router;
