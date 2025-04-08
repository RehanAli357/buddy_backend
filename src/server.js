import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import initRoutes from "./routes/index.js";

const app = express();

app.use(cors());

dotenv.config({ path: "../.env" });

const PORT = process.env.LOCAL_HOST || 8000;

app.use(express.json());
initRoutes(app)

app.listen(PORT, () => {
  console.log("listen", PORT);
});
