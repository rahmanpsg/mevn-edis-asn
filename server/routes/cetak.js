const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const permohonanModel = require("../models/permohonan");
const verifikatorModel = require("../models/verifikator");
const moment = require("moment");
const qrcode = require("qrcode");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// generete PDF Permohonan
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const permohonan = await permohonanModel.findOne({ _id: id }).populate({
    path: "pegawai",
    select: "-password -role -createdAt -updatedAt",
    populate: [
      { path: "golongan" },
      { path: "unor", populate: { path: "unor_induk" } },
    ],
  });

  if (permohonan == null) {
    res.send({ error: true, message: "ID permohonan tidak ditemukan" });
  }

  const tahap = permohonan.jenis == "disiplin" ? 4.1 : 4.2;

  const verifikator = await verifikatorModel.findOne({ tahap }).populate({
    path: "pegawai",
    select: "-password -role -unor -createdAt -updatedAt",
    populate: { path: "golongan" },
  });

  let doc = new PDFDocument({
    size: "LEGAL",
    margins: { top: 10, left: 30, right: 30, bottom: 10 },
  });

  try {
    const listFont = [
      { name: "regular", file: "BOOKOS.TTF" },
      { name: "bold", file: "BOOKOSB.TTF" },
      { name: "italic", file: "BOOKOSI.TTF" },
    ];

    const _path =
      process.env.NODE_ENV == "production"
        ? process.env.baseURL_production
        : process.env.baseURL;

    for (const font of listFont) {
      const response = await fetch(_path + font.file);
      const buffer = await response.arrayBuffer();

      doc.registerFont(font.name, buffer);
    }
  } catch (error) {
    console.log(error);
  }

  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Access-Control-Allow-Origin": "*",
  });

  doc.pipe(res);

  doc.moveDown(6);

  doc.image("public/logo.png", doc.page.width / 2 - 70 / 2, 30, {
    align: "center",
    valign: "center",
    fit: [70, 70],
  });

  doc.moveDown();

  doc
    .font("regular")
    .fontSize(12)
    .text("PEMERINTAH KABUPATEN SIDENRENG RAPPANG", { align: "center" });

  doc.font("bold").text("SEKRETARIAT DAERAH KABUPATEN", { align: "center" });

  doc
    .font("regular")
    .fontSize(10)
    .text("Jl. HARAPAN BARU KOMPLEKS SKPD BLOK A NO. 1 PANGKAJENE SIDENRENG", {
      align: "center",
    });

  doc.text("TELEPON (0421) 3590011 FAX (0421) 3590000 KODE POS 91661", {
    align: "center",
  });

  doc.lineWidth(1);

  doc.lineCap("butt").moveTo(50, 160).lineTo(560, 160).stroke();
  doc.lineCap("butt").moveTo(50, 162).lineTo(560, 162).stroke();

  doc.moveDown();

  doc.font("bold").fontSize(13).text("SURAT PERNYATAAN", { align: "center" });

  if (permohonan.jenis == "disiplin") {
    doc
      .font("bold")
      .fontSize(11)
      .text("TIDAK PERNAH DIJATUHI HUKUMAN DISIPLIN TINGKAT BERAT/ SEDANG", {
        align: "center",
        underline: true,
      });
  } else {
    doc
      .font("bold")
      .fontSize(11)
      .text(
        "TIDAK SEDANG MENJALANI PROSES PIDANA ATAU PERNAH DIPIDANA PENJARA",
        {
          align: "center",
        }
      );

    doc.text(
      "BERDASARKAN PUTUSAN PENGADILAN YANG TELAH BERKEKUATAN HUKUM TETAP",
      {
        align: "center",
        underline: true,
      }
    );
  }

  doc.moveDown();

  const nomorSurat =
    permohonan.jenis == "disiplin"
      ? "NOMOR : 881.3/              /BKPSDM"
      : "NOMOR : 800 /";

  doc.font("regular").text(nomorSurat, {
    align: "center",
  });

  doc.moveDown();

  doc.text("Yang bertanda tangan di bawah ini :");

  doc.moveDown();

  const opt = { continued: true };

  let x = 75;

  const daftar = (data) => {
    doc.text("Nama", x, doc.y, opt);
    doc.text(`: ${namaGelarFormat(data)}`, doc.x + 146, doc.y);

    doc.text("NIP", x, doc.y, opt);
    doc.text(`: ${data.nip}`, doc.x + 159, doc.y);

    doc.text("Pangkat / Gol. Ruang", x, doc.y, opt);
    doc.text(
      `: ${data.golongan.pangkat} / ${data.golongan.golongan}`,
      doc.x + 60,
      doc.y
    );

    doc.text("Jabatan", x, doc.y, opt);
    doc.text(`: ${data.jabatan}`, doc.x + 134, doc.y);
  };

  daftar(verifikator.pegawai);

  doc.moveDown();

  doc.text(
    "Dengan ini menyatakan dengan sesungguhnya bahwa Pegawai Negeri Sipil :",
    30
  );

  doc.moveDown();

  daftar(permohonan.pegawai);

  doc.text("Unit Kerja", x, doc.y, opt);
  doc.text(`: ${permohonan.pegawai.unor.nama} pada`, doc.x + 123, doc.y);
  doc.text(permohonan.pegawai.unor.unor_induk.unor_induk, doc.x + 185, doc.y);

  doc.moveDown();

  doc.x = 30;

  if (permohonan.jenis == "disiplin") {
    doc.text(
      "Dalam 1 (satu) tahun terakhir ini tidak pernah dijatuhi hukuman disiplin tingkat sedang/ berat.",
      { align: "justify" }
    );
  } else {
    doc.text(
      "Tidak  sedang menjalani proses pidana atau pernah dipidana penjara berdasarkan putusan pengadilan yang telah berkekutan hukum tetap karena melakukan tindak pidana kejahatan jabatan atau tindak pidana kejahatan yang ada hubungannya dengan jabatan dan atau pidana umum.",
      { align: "justify", indent: 50 }
    );
  }

  doc.moveDown();

  doc.text(
    "Demikian  Surat  Pernyataan  ini  Saya  buat  dengan  sesungguhnya dengan mengingat sumpah jabatan, dan apabila dikemudian hari ternyata isi surat pernyataan ini tidak benar  yang mengakibatkan kerugian negara, maka saya bersedia menanggung kerugian tersebut.",
    { align: "justify", indent: 50 }
  );

  doc.moveDown();
  doc.moveDown();

  const tanggal = moment().format("DD MMMM YYYY");

  doc.x = 300;

  doc.text(`Pangkajene Sidenreng, ${tanggal}`);
  doc.moveDown();

  const y = doc.y;

  const jabatan =
    permohonan.jenis == "disiplin"
      ? "SEKRETARIS DAERAH KABUPATEN"
      : "ASISTEN PEMERINTAHAN DAN KESRA";

  doc.font("bold").text(jabatan);

  doc.moveDown(7);

  doc
    .font("regular")
    .text(namaGelarFormat(verifikator.pegawai), { underline: true });

  x = 300;

  doc.text("Pangkat", x, doc.y, opt);
  doc.text(
    `: ${verifikator.pegawai.golongan.pangkat}, ${verifikator.pegawai.golongan.golongan}`,
    doc.x + 15,
    doc.y
  );

  doc.text("NIP", x, doc.y, opt);
  doc.text(`: ${verifikator.pegawai.nip}`, doc.x + 40, doc.y);

  doc.moveDown(4);

  doc.x = 30;

  doc.font("italic").fontSize(9).text("Tembusan :");

  let listTembusan;

  if (permohonan.jenis == "disiplin") {
    listTembusan = [
      "Kepala Badan Kepegawaian di Jakarta",
      "Kepala Kantor Regional IV BKN di Makassar",
      "Bupati Sidenreng Rappang sebagai laporan",
      "Yang Bersangkutan untuk diketahui",
      "Pertinggal",
    ];
  } else {
    listTembusan = [
      "Bupati Sidenreng Rappang sebagai laporan",
      "Kepala BKPSDM Sidrap di Pangkajene",
      "Pertinggal",
    ];
  }

  doc.x = 50;

  for (const tembusan in listTembusan) {
    doc.text(Number(tembusan) + 1 + ".", opt);
    doc.text(listTembusan[tembusan], doc.x + 3, doc.y, {
      underline: tembusan == listTembusan.length - 1,
    });
  }

  const url =
    (process.env.NODE_ENV == "production"
      ? process.env.baseURL_production
      : process.env.baseURL) + `cetak/${permohonan.id}`;

  console.log(url);

  const QR = await qrcode.toDataURL(url);

  doc.image(QR, doc.x + 250, y + 12, { fit: [90, 90] });

  doc.end();
});

const namaGelarFormat = (item) => {
  return (
    (item.gelar_depan ? `${item.gelar_depan} ` : "") +
    item.nama +
    (item.gelar_belakang ? `, ${item.gelar_belakang}` : "")
  ).toUpperCase();
};

module.exports = router;
