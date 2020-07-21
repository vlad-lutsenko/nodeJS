const express = require("express");
const router = express.Router();

const contactsController = require("../controllers/ContactsController");

router.get("/", async (req, res) => {
  try {
    const contacts = await contactsController.listContacts();
    res.status(200).send(contacts);
  } catch (error) {
    console.error(error);
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const contact = await contactsController.getById(contactId);
    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }
    res.status(200).send(contact);
  } catch (error) {
    console.error(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).send({ message: "missing required name field" });
    }

    const newContact = await contactsController.addContact(name, email, phone);
    res.status(201).send(newContact);
  } catch (error) {
    console.error(error);
  }
});

router.patch("/:contactId", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const id = parseInt(req.params.contactId);

    if (!req.body) {
      return res.status(400).send({ message: "missing fields" });
    }

    const newContact = await contactsController.updateContact(id, {
      name,
      email,
      phone,
    });

    res.status(200).send(newContact);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not found" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const id = parseInt(req.params.userId, 10);
    await contactsController.removeContact(id);
    res.status(200).send({ message: "contact deleted" });
  } catch (error) {
    res.status(404).send({ message: "not found" });
  }
});

module.exports = router;
