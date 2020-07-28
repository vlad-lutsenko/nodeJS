const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ContactSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: (email) => {
      if (!email.includes("@")) {
        throw new Error("wrong email format");
      }
      return true;
    },
  },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: String,
});

ContactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Contact", ContactSchema);
