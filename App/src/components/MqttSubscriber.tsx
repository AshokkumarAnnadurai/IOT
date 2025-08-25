import React, { useEffect, useState } from "react";

const MqttSubscriber = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000"); // backend server

    ws.onopen = () => console.log("Connected to backend WebSocket");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>MQTT Messages from Backend</h2>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>
            <strong>{m.topic}:</strong> {m.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MqttSubscriber;
