const express = require("express");
const WebSocket = require("ws");
const mqtt = require("mqtt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 5000;

// ------------------ Middleware ------------------
app.use(bodyParser.json());
app.use(cors());

// ------------------ MongoDB ------------------
const mongoURI = "mongodb+srv://ashokkumara:7qn29QKAfsXR2GUZ@testcluster0.h00b0ge.mongodb.net/";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ------------------ Contact Schema ------------------
const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  phone: String,
  email: String,
  company: String
});

const Contact = mongoose.model("Contact", contactSchema);

// ------------------ Swagger Setup ------------------
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Contacts API",
      version: "1.0.0",
      description: "CRUD API for managing contacts"
    },
    servers: [
      {
        url: `https://iot-production-8482.up.railway.app`
      }
    ]
  },
  apis: ["./server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ------------------ CRUD API ------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         company:
 *           type: string
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: List of contacts
 */
app.get("/contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

/**
 * @swagger
 * /contacts/{phone}:
 *   get:
 *     summary: Get contact by Phone Number
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: Phone number of the contact
 *     responses:
 *       200:
 *         description: Contact object
 *       404:
 *         description: Contact not found
 */
app.get("/contacts/:phone", async (req, res) => {
  try {
    console.log("🚀 ~ req:", req)
    const contact = await Contact.findOne({ phone: req.params.phone })
    if (!contact) return res.status(404).send("Contact not found");
    res.json(contact);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created
 */
app.post("/contacts", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * @swagger
 * /contacts/{phone}:
 *   put:
 *     summary: Update contact by ID
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Updated contact
 *       404:
 *         description: Contact not found
 */
app.put("/contacts/:phone", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate({ phone: req.params.phone }, req.body, { new: true });
    if (!updatedContact) return res.status(404).send("Contact not found");
    res.json(updatedContact);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * @swagger
 * /contacts/{phone}:
 *   delete:
 *     summary: Delete contact by ID
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted
 *       404:
 *         description: Contact not found
 */
app.delete("/contacts/:phone", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete({ phone: req.params.phone });
    if (!deletedContact) return res.status(404).send("Contact not found");
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// ------------------ MQTT + WebSocket (existing code) ------------------
// const wss = new WebSocket.Server({ noServer: true });

// const mqttClient = mqtt.connect("mqtt://test.mosquitto.org");

// mqttClient.on("connect", () => {
//   console.log("Connected to MQTT broker");
//   mqttClient.subscribe("sensor/temperature");

//   setInterval(() => {
//     const temp = Math.floor(Math.random() * 35) + 15;
//     const msg = `Temp: ${temp}°C`;
//     mqttClient.publish("sensor/temperature", msg);
//     console.log("Published:", msg);
//   }, 5000);
// });

// mqttClient.on("message", (topic, message) => {
//   console.log(`MQTT Message: ${topic} = ${message.toString()}`);
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ topic, message: message.toString() }));
//     }
//   });
// });

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// server.on("upgrade", (req, socket, head) => {
//   wss.handleUpgrade(req, socket, head, (ws) => {
//     wss.emit("connection", ws, req);
//   });
// });
