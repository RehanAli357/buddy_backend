import { loginUserDB } from "../../models/user-model.js";
import jwt from "jsonwebtoken";
import { loginUserSchema } from "./validators/index.js";
export const loginUser = async (req, res) => {
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const { username, password } = req.body;

  const user = await loginUserDB(username, password);
  console.log(user)
  if (user.status === true) {
    const sessionToken = jwt.sign(
      {
        username: user.data.username,
        userId: user.data.id,
      },
      process.env.JWT_SECRETE,
      { expiresIn: "24h" }
    );

    res.status(user.code).json({ ...user, token: sessionToken });
  } else {
    res.status(user.code).json(user);
  }
};
