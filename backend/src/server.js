import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngestClient, functions } from "./lib/inngest.js";
import cors from "cors";
import { fileURLToPath } from 'url';
import 'dotenv/config';
import {clerkMiddleware} from "@clerk/express"
import { protectRoute } from "./middlewares/protectRoute.js";
import chatRoutes  from "./routes/chatRoutes.js"

const app = express();
const port = ENV.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
//credentials: true  :- it mean s server allowed the browser to include to cookies
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngestClient, functions }));
app.use("/api/chats", chatRoutes)

app.get("/health", (req, res) => {

  res.status(200).json({ msg: "talent-iq is up and running" });
});

// make our app ready for deployment

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
});

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
