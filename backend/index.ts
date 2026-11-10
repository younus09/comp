import express from "express";
import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

const app = express();

app.use(express.json());

app.post("/submission", (req, res) => {
  const { userId, code, language } = req.body;

  client.lPush("problemStatement", JSON.stringify({ userId, code, language }));
  res.status(200).json({ message: "pending" });
});

app.get("/submission/:sumbissionId", (req, res) => {});

app.listen(3000);
