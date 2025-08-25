const express = require("express");
const WebSocket = require("ws");
const mqtt = require("mqtt");

const app = express();
const PORT = 5000;

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// MQTT Client
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org"); // public broker

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("sensor/temperature");

  // TEST PUBLISHER: send dummy temperature every 5 seconds
  setInterval(() => {
    const temp = Math.floor(Math.random() * 35) + 15; // random between 15-50
    const msg = `Temp: ${temp}°C`;
    mqttClient.publish("sensor/temperature", msg);
    console.log("Published:", msg);
  }, 5000);
});

// When a message comes from MQTT
mqttClient.on("message", (topic, message) => {
  console.log(`MQTT Message: ${topic} = ${message.toString()}`);

  // Broadcast to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ topic, message: message.toString() }));
    }
  });
});

// Upgrade HTTP server to WebSocket
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
