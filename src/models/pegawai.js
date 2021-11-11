class PegawaiModel {
  constructor({ _id, nip, nama, username, password, image }) {
    this._id = _id;
    this.nip = nip;
    this.nama = nama;
    this.username = username;
    this.password = password;
    this.image = image;
  }
}

export default PegawaiModel;
