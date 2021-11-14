class PermohonanModel {
  constructor({
    _id,
    pegawai,
    jenis,
    keterangan = "MENUNGGU KONFIRMASI TAHAP 1",
    status = [],
  }) {
    this._id = _id;
    this.pegawai = pegawai;
    this.jenis = jenis;
    this.keterangan = keterangan;
    this.status = status;
  }
}

export default PermohonanModel;
