class PegawaiModel {
  constructor({
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
  }) {
    this._id = _id;
    this.nip = nip;
    this.nama = nama;
    this.gelar_depan = gelar_depan;
    this.gelar_belakang = gelar_belakang;
    this.username = username;
    this.password = password;
    this.golongan = golongan;
    this.unor = unor;
    this.jabatan = jabatan;
  }
}

export default PegawaiModel;
