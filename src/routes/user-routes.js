import { Router } from "express";
import {
  deleteUserAccount,
  getUserById,
  loginUser,
  registerUser,
  updateEmail,
  updatePassword,
  updateUsername,
  updateUserType,
} from "../controllers/user-controllers/index.js";
import { userAuthTokenMiddleware } from "../middlewares/user-auth-middleware.js";
const route = Router();
route.post("/register", registerUser);
route.post("/login", loginUser);
route.get("", userAuthTokenMiddleware, getUserById);
route.patch("/update-password", userAuthTokenMiddleware, updatePassword);
route.patch("/update-email", userAuthTokenMiddleware, updateEmail);
route.patch("/update-username", userAuthTokenMiddleware, updateUsername);
route.patch("/upgrade", userAuthTokenMiddleware, updateUserType);
route.delete("/delete", userAuthTokenMiddleware, deleteUserAccount);
console.log("calll from user route")

export default route;
