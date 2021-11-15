const express = require("express");
const permohonanModel = require("../models/permohonan");
const verifikasiModel = require("../models/verifikasi");
const verifikatorModel = require("../models/verifikator");
const router = express.Router();
const auth = require("../middleware/auth");

// get all data permohonan
router.get("/", auth, async (req, res) => {
  const permohonans = await permohonanModel
    .find()
    .populate("pegawai", "nama gelar_depan gelar_belakang");

  const verifikasis = await verifikasiModel
    .find()
    .populate("verifiedBy", "tahap")
    .sort("tahap");

  const data = getVerifData(permohonans, verifikasis);

  res.send(data);
});

// get permohonan by pegawai
router.get("/pegawai/:id", auth, async (req, res) => {
  const id = req.params.id;

  const permohonans = await permohonanModel.find({ pegawai: id });

  const verifikasis = await verifikasiModel
    .find({ permohonan: { $in: permohonans } })
    .populate("verifiedBy", "tahap")
    .sort("tahap");

  const data = getVerifData(permohonans, verifikasis);

  res.send(data);
});

// get permohonan by verifikator
router.get("/verifikator/:id", auth, async (req, res) => {
  const id = req.params.id;

  const verifikator = await verifikatorModel.findOne({ _id: id });

  const permohonans = await permohonanModel.find().populate({
    path: "pegawai",
    select: "-password -role -createdAt -updatedAt",
    populate: [
      { path: "golongan" },
      { path: "unor", populate: { path: "unor_induk" } },
    ],
  });

  const verifikasis = await verifikasiModel
    .find({
      permohonan: { $in: permohonans },
    })
    .populate("verifiedBy", "tahap")
    .sort("tahap");

  const data = getVerifData(permohonans, verifikasis);

  let filter;

  // periksa tahap verifikasi
  if (Math.floor(verifikator.tahap) == 4) {
    // 4.1 Disiplin
    // 4.2 Pidana
    const jenis = verifikator.tahap == 4.1 ? "disiplin" : "pidana";
    filter = data.filter((d) => d.status.length >= 3 && d.jenis == jenis);
  } else {
    filter = data.filter((d) => d.status.length >= verifikator.tahap - 1);
  }

  res.send(filter);
});

// verifikasi data permohonan
router.post("/verifikasi", auth, async (req, res) => {
  const verifikasi = new verifikasiModel(req.body);

  verifikasi.save((err, doc) => {
    if (err) return res.status(500).send({ message: err.message });

    res.status(200).send({
      message:
        "Permohonan berhasil " +
        `${verifikasi.status ? "diterima" : "ditolak"}`,
      waktuVerif: doc.createdAt,
    });
  });
});

// save data permohonan
router.post("/", auth, async (req, res) => {
  const { pegawai, jenis } = req.body;

  const permohonans = new permohonanModel({
    pegawai,
    jenis,
  });

  permohonans.save((err, doc) => {
    if (err) return res.status(500).send({ message: err.message });

    res.status(200).send({
      message: "Permohonan berhasil dikirim",
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

const getVerifData = (permohonans, verifikasis) => {
  return permohonans.map((per) => {
    const verif = verifikasis.filter(
      (ver) => ver.permohonan.toString() == per._id.toString()
    );

    let status = [];
    let waktuVerif = [];
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

      waktuVerif = verif.map((ver) => ver.createdAt);
    }
    return { ...per._doc, status, waktuVerif, keterangan };
  });
};

module.exports = router;
