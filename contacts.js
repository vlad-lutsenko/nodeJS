const fs = require("fs").promises;
const path = require("path");
const constants = require("./constants");

const contactsPath = path.join(__dirname, "db", constants.CONTACTS_FILE);

async function listContacts() {
  const contactsList = await fs.readFile(contactsPath, "utf-8");
  console.log(JSON.parse(contactsList));
}

async function getContactById(contactId) {
  const contactsList = await fs.readFile(contactsPath, "utf-8");
  const parsedList = JSON.parse(contactsList);
  const neededContact = parsedList.filter(
    (contact) => contact.id === contactId
  );
  console.log(neededContact);
}

async function removeContact(contactId) {
  const contactsList = await fs.readFile(contactsPath, "utf-8");
  const parsedList = JSON.parse(contactsList);
  const filteredList = parsedList.filter((contact) => contact.id !== contactId);
  console.log(filteredList);
}

async function addContact(name, email, phone) {
  const contactsList = await fs.readFile(contactsPath, "utf-8");
  const parsedList = JSON.parse(contactsList);
  const id = parsedList[parsedList.length - 1].id + 1;
  const newContact = { id, name, email, phone };
  parsedList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(parsedList));
  console.log(parsedList);
}

exports.listContacts = listContacts;
exports.getContactById = getContactById;
exports.addContact = addContact;
exports.removeContact = removeContact;
