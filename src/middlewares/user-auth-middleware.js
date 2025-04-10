import jwt from "jsonwebtoken";
import { authTokenUserSchema } from "../controllers/user-controllers/validators/index.js";

export const userAuthTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const { error } = authTokenUserSchema.validate({ authHeader });
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const tokenWithoutBearer = authHeader.split(" ")[1];
  try {
    const decodeToken = jwt.verify(
      tokenWithoutBearer.trim(""),
      process.env.JWT_SECRET
    );
    req.user = decodeToken;
    next();
  } catch (error) {
    console.log("Error in Auth Token", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
