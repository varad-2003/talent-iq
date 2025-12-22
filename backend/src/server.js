import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

const app = express();
const port = ENV.PORT;

const __dirname = path.resolve();

app.get("/books", (req, res) => {
  res.status(200).json({ msg: "hello from talent-iq" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "talent-iq is up and running" });
});

// make our app ready for deployment

if (ENV.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
