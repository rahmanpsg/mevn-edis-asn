const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const verifikatorModel = require("../models/verifikator");
const router = express.Router();

// login
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    userModel
      .findOne({ username })
      .populate("golongan")
      .populate({ path: "unor", populate: { path: "unor_induk" } })
      .exec(async (err, doc) => {
        if (err) {
          res.status(500).send({ message: err.message });
          return;
        }

        if (!doc) {
          res
            .status(404)
            .send({ error: true, message: "Username tidak ditemukan" });
          return;
        }

        if (password != doc.password) {
          res
            .status(401)
            .send({ error: true, message: "Username atau password salah" });
          return;
        }

        const user = doc.toJSON();

        // periksa jika user adalah verifikator
        if (user.role == "pegawai") {
          const verifikator = await verifikatorModel.findOne({ pegawai: user });

          if (verifikator != null) {
            user._id = verifikator.id;
            user.role = "verifikator";
            user.tahap = verifikator.tahap;
          }
        }

        // Create token
        const token = jwt.sign(
          { id: user._id, username },
          process.env.TOKEN_KEY,
          {
            expiresIn: "7 days",
          }
        );

        user.token = token;

        res.status(200).send({
          error: false,
          message: "Anda berhasil login",
          user,
        });
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/cek/:token", async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res
      .status(403)
      .send({ error: true, message: "Token diperlukan untuk otentikasi" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await userModel.findOne(
      { username: decoded.username },
      "username password nama nip image"
    );
    return res.send(user);
  } catch (err) {
    console.log(err);
    return res.status(401).send({ error: true, message: "Token Tidak Valid" });
  }
});

module.exports = router;
