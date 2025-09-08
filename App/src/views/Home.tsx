import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (event) => {
      const { topic, message } = JSON.parse(event.data);
      const metricName = topic.split("/")[1]; // e.g. "temperature"
      const numericValue = parseFloat(message.replace(/[^\d.-]/g, ""));

      setMetrics((prev) => {
        const current = prev[metricName] || { latest: "-", history: [] };
        return {
          ...prev,
          [metricName]: {
            latest: numericValue,
            unit: message.replace(/[0-9.-]/g, "").trim(),
            history: [
              ...current.history.slice(-19),
              { time: new Date().toLocaleTimeString(), value: numericValue },
            ],
          },
        };
      });
    };

    return () => ws.close();
  }, []);

  const createChartData = (data, label, color) => ({
    labels: data.map((p) => p.time),
    datasets: [
      {
        label,
        data: data.map((p) => p.value),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.3,
      },
    ],
  });

  const colors = ["red", "blue", "green", "orange", "purple", "teal", "brown"];

  // Example thresholds (you can customize per metric)
  const thresholds = {
    temperature: { min: 15, max: 40 },
    humidity: { min: 30, max: 70 },
    pressure: { min: 950, max: 1050 },
  };

  return (
    <div style={{ width: "95%", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🌐 Realtime IoT Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "20px",
        }}
      >
        {Object.keys(metrics).map((metric, idx) => {
          const { latest, unit, history } = metrics[metric];
          const color = colors[idx % colors.length];

          // Alert check
          const threshold = thresholds[metric];
          const alert =
            threshold &&
            (latest < threshold.min || latest > threshold.max);

          return (
            <div
              key={metric}
              style={{
                padding: 20,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: alert ? "2px solid red" : "1px solid #eee",
              }}
            >
              <h3 style={{ textTransform: "capitalize" }}>{metric}</h3>

              {/* Gauge */}
              <GaugeChart
                id={`gauge-${metric}`}
                nrOfLevels={20}
                percent={latest && threshold
                  ? (latest - threshold.min) /
                    (threshold.max - threshold.min)
                  : 0.5}
                colors={["#00FF00", "#FFBF00", "#FF0000"]}
                textColor="#000"
              />
              <p style={{ fontSize: "18px", margin: "10px 0" }}>
                Latest: <b>{latest}{unit}</b>
                {alert && <span style={{ color: "red" }}> ⚠️ Out of range</span>}
              </p>

              {/* Line Chart */}
              <Line
                data={createChartData(history, `${metric} readings`, color)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
