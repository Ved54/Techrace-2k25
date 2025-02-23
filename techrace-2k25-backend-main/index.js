import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import userRoute from "./routes/users.js";
import loginRoute from "./routes/login.js";
import gameRoute from "./routes/game.js";
import volunteersRoute from "./routes/volunteers.js";

import multer from "multer";
import cors from "cors";

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;


app.use(cors());

app.use(bodyParser.json());
app.use(upload.array());
app.use("/api/users", userRoute);
app.use("/api/login", loginRoute);
app.use("/api/game", gameRoute);
app.use("/api/volunteers", volunteersRoute);

app.get("/", (req, res) => res.send("Hitesh here , hello pussies"));

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);

//filhaal do trash
