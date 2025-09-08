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
  mqttClient.subscribe(["sensor/temperature", "sensor/humidity", "sensor/pressure"]);

  // TEST PUBLISHER
  setInterval(() => {
    const temp = Math.floor(Math.random() * 35) + 15;
    mqttClient.publish("sensor/temperature", `${temp}°C`);

    const humidity = Math.floor(Math.random() * 50) + 30;
    mqttClient.publish("sensor/humidity", `${humidity}%`);

    const pressure = Math.floor(Math.random() * 20) + 980;
    mqttClient.publish("sensor/pressure", `${pressure} hPa`);

    console.log("Published Temp/Humidity/Pressure");
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
