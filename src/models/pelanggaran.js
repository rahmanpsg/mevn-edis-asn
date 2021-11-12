class PelanggaranModel {
  constructor({ _id, pegawai, jenis, tanggal, keterangan }) {
    this._id = _id;
    this.pegawai = pegawai;
    this.jenis = jenis;
    this.tanggal = tanggal;
    this.keterangan = keterangan;
  }
}

export default PelanggaranModel;
