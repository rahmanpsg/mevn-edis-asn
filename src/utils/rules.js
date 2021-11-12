const uniqRules = (field, editedIndex, items) => {
  return [
    (v) => !!v || `${field} tidak boleh kosong`,
    (v) => {
      return (
        (editedIndex != -1 && items[editedIndex][field] == v) ||
        !items.find((item) => item[field] == v) ||
        `${field} telah digunakan`
      );
    },
  ];
};

const uniqWithLengthRules = (field, editedIndex, items) => {
  return [
    (v) => !!v || `${field} tidak boleh kosong`,
    (v) => (v && v.length >= 6) || `${field} minimal 6 karakter`,
    (v) => {
      return (
        (editedIndex != -1 && items[editedIndex].username == v) ||
        !items.find((item) => item.username == v) ||
        `${field} telah digunakan`
      );
    },
  ];
};

export default { uniqRules, uniqWithLengthRules };
