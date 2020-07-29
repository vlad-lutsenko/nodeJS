const ContactModel = require("../models/ContactModel");

class ContactsController {
  async listContacts(req) {
    const { page, limit, sub } = req.query;

    if (page || limit || sub) {
      const query = { ...(sub && { subscription: sub }) };
      const options = { ...(page && limit && { page, limit }) };

      const contacts = await ContactModel.paginate(query, options);

      return contacts;
    }

    const contacts = await ContactModel.find();
    return contacts;
  }

  async getById(id) {
    const contact = await ContactModel.findById(id);
    return contact;
  }

  async addContact(data) {
    const contact = await ContactModel.create(data);
    return contact;
  }

  async updateContact(id, data) {
    const contact = await ContactModel.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      { new: true }
    );
    if (!contact) throw new Error();

    return contact;
  }

  async removeContact(id) {
    await ContactModel.findByIdAndDelete(id);
  }
}

module.exports = new ContactsController();
