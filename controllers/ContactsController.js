const fs = require("fs").promises;

const path = require("path");

const constants = require("../constants");

const pathToJsonFile = path.join("db", constants.CONTACTS_FILE);

class ContactsController {
  async listContacts() {
    const contactsString = await fs.readFile(pathToJsonFile, "utf-8");

    return contactsString;
  }

  async getById(id) {
    const contactsString = await fs.readFile(pathToJsonFile, "utf-8");
    const parsedContacts = JSON.parse(contactsString);
    const neededContact = parsedContacts.find((contact) => contact.id === id);

    return JSON.stringify(neededContact);
  }

  async addContact(name, email, phone) {
    const contactsString = await fs.readFile(pathToJsonFile, "utf-8");
    const parsedContacts = JSON.parse(contactsString);
    const id = parsedContacts.length + 1;
    const newContact = { id, name, email, phone };
    parsedContacts.push(newContact);
    await fs.writeFile(pathToJsonFile, JSON.stringify(parsedContacts), "utf-8");

    return newContact;
  }

  async updateContact(id, data) {
    const contactsString = await fs.readFile(pathToJsonFile, "utf-8");
    const parsedContacts = JSON.parse(contactsString);

    const contactIndex = parsedContacts.findIndex(
      (contact) => contact.id === id
    );
    if (contactIndex === -1) {
      throw new Error("contact not found");
    }

    const { name, email, phone } = data;

    const newName = name ? name : parsedContacts[contactIndex].name;
    const newEmail = email ? email : parsedContacts[contactIndex].email;
    const newPhone = phone ? phone : parsedContacts[contactIndex].phone;

    parsedContacts[contactIndex] = {
      id,
      name: newName,
      email: newEmail,
      phone: newPhone,
    };

    await fs.writeFile(pathToJsonFile, JSON.stringify(parsedContacts), "utf-8");

    return parsedContacts[contactIndex];
  }

  async removeContact(id) {
    const contactsString = await fs.readFile(pathToJsonFile, "utf-8");
    const parsedContacts = JSON.parse(contactsString);
    const contactIndex = parsedContacts.findIndex(
      (contact) => contact.id === id
    );
    if (contactIndex === -1) {
      throw new Error("contact not found");
    }

    parsedContacts.splice(contactIndex, 1);

    await fs.writeFile(pathToJsonFile, JSON.stringify(parsedContacts), "utf-8");

    return parsedContacts;
  }
}

module.exports = new ContactsController();
