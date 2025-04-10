import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import initRoutes from "./routes/index.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors());
app.use(express.json());
initRoutes(app);

const PORT = process.env.LOCAL_HOST || 8000;

app.listen(PORT, () => {
  console.log("listen", PORT);
});
