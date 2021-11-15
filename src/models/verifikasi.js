class VerifikasiModel {
  constructor({ _id, permohonan, status, verifiedBy }) {
    this._id = _id;
    this.permohonan = permohonan;
    this.status = status;
    this.verifiedBy = verifiedBy;
  }
}

export default VerifikasiModel;
