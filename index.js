const express = require("express");
const promClient = require('prom-client');

// Create a Prometheus registry
const registry = new promClient.Registry();

// Create a counter metric
const counter = new promClient.Counter({
  name: 'example_counter',
  help: 'A simple example counter metric',
  registers: [registry],
});

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "hello Gaurav",
  });
});

// Expose a route to increment the counter
app.get('/increment', (req, res) => {
  counter.inc();
  res.send('Counter incremented!');
});

// Expose Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.get('/nested/metrics', async (req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("App is running");
});
