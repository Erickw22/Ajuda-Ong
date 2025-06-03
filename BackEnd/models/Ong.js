const mongoose = require("mongoose");

const OngSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return !v || /^\S+@\S+\.\S+$/.test(v);
        },
        message: (props) => `${props.value} não é um email válido!`,
      },
    },
    description: { type: String, trim: true },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    socialMedia: {
      instagram: { type: String, trim: true, default: "" },
      facebook: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      // Você pode adicionar outras redes aqui
    },

    pixKey: { type: String, trim: true, default: "" }, // chave Pix (CPF, e-mail, telefone, etc)
  },
  {
    timestamps: true, // cria createdAt e updatedAt automaticamente
  }
);

module.exports = mongoose.model("Ong", OngSchema);
