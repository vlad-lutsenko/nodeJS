const express = require("express");
const router = express.Router();

const contactsController = require("../controllers/ContactsController");

router.get("/", async (req, res) => {
  try {
    const contacts = await contactsController.listContacts(req);
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
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
    const { name, email, phone, subscription, password } = req.body;

    if (!name || !email || !phone || !subscription || !password) {
      return res.status(400).send({ message: "missing required field" });
    }

    const newContact = await contactsController.addContact(req.body);

    res.status(201).send(newContact);
  } catch (error) {
    console.error(error);
  }
});

router.patch("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsController.updateContact(contactId, req.body);
    res.status(200).send(contact);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not found" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await contactsController.removeContact(userId);

    res.status(200).send({ message: "contact deleted" });
  } catch (error) {
    res.status(404).send({ message: "not found" });
  }
});

module.exports = router;
