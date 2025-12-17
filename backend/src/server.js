import express from "express";
import { ENV } from "./lib/env.js";

const app = express()
const port = ENV.PORT

app.get("/", (req, res) => {
    res.status(200).json({msg:"hello from talent-iq"})
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
    
})