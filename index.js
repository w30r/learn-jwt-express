import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

const app = express();
const PORT = 3000;
configDotenv();

app.use(express.json());

app.get("/", authenticateToken, (req, res) => {
  res.send("Hello World!");
});

app.get("/posts", (req, res) => {
  const posts = [
    {
      title: "Post 1",
      description: "This is post 1",
    },
    {
      title: "Post 2",
      description: "This is post 2",
    },
  ];
  res.send(posts).status(200);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { id: 1, username: username, password: "entah" };

  // Generate JWT
  const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "15s",
  });

  return res.json({ user, accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT} =========================`);
});
