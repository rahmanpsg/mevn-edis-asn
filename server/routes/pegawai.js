const express = require("express");
const pegawaiModel = require("../models/user");
const router = express.Router();
const auth = require("../middleware/auth");

// get all data pegawai
router.get("/", auth, async (req, res) => {
  const { select } = req.query;

  if (select == null) {
    const data = await pegawaiModel
      .find({ role: "pegawai" })
      .populate("golongan", "golongan")
      .populate("unor", "nama");

    res.send(data);
  } else if (select == "list") {
    const data = await pegawaiModel
      .find({ role: "pegawai" })
      .select("nip nama gelar_depan gelar_belakang");

    const pegawai = data.map((p) => {
      return {
        ...p._doc,
        namaWithGelar:
          // p.gelar_depan +
          // p.nama +
          // (p.gelar_belakang ? `, ${p.gelar_belakang}` : ""),
          `${p.gelar_depan ?? ""} ${p.nama}${p.gelar_belakang ? "," : ""} ${
            p.gelar_belakang ?? ""
          }`.trim(),
      };
    });

    res.send(pegawai);
  }
});

// save data pegawai
router.post("/", auth, async (req, res) => {
  const {
    nip,
    nama,
    gelar_depan,
    gelar_belakang,
    username,
    password,
    golongan,
    unor,
    jabatan,
  } = req.body;

  const users = new pegawaiModel({
    nip,
    nama,
    gelar_depan,
    gelar_belakang,
    username,
    password,
    golongan,
    unor,
    jabatan,
    role: "pegawai",
  });

  users.save(async (err, doc) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Data pegawai berhasil disimpan",
      id: doc._id,
    });
  });
});

// ubah data pegawai
router.put("/", auth, async (req, res) => {
  const {
    _id,
    nip,
    nama,
    gelar_depan,
    gelar_belakang,
    username,
    password,
    golongan,
    unor,
    jabatan,
  } = req.body;

  const newData = {
    nip,
    nama,
    gelar_depan,
    gelar_belakang,
    username,
    password,
    golongan,
    unor,
    jabatan,
  };

  pegawaiModel.findByIdAndUpdate(
    _id,
    newData,
    { useFindAndModify: false },
    async (err) => {
      if (err) return res.status(500).send({ message: err });

      res.status(200).send({
        message: "Pegawai berhasil diubah",
      });
    }
  );
});

// hapus data pegawai
router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(404).send({ message: "ID tidak ditemukan" });
  }

  pegawaiModel.deleteOne({ _id }, (err) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({
      message: "Pegawai berhasil dihapus",
    });
  });
});

module.exports = router;
