import { Router } from "express";
import { loginUser } from "../controllers/user-controllers/index.js";
const route = Router();

route.post("/login", loginUser);

export default route;
