import {
  changeEmail,
  changePassword,
  changeUserDeleteType,
  changeUsername,
  changeUserType,
  insertUser,
  loginUserDB,
  selectUserById,
} from "../../models/user-model.js";
import jwt from "jsonwebtoken";
import {
  loginUserSchema,
  registerUserSchema,
  updateEmailSchema,
  updatePasswordSchema,
  updateUsernameSchema,
} from "./validators/index.js";


export const registerUser = async (req, res) => {
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const { username, firstname, lastname, password, email } = req.body;

  const user = await insertUser(
    username,
    firstname,
    lastname,
    password,
    "free",
    email
  );

  if (user.status === true) {
    return res.status(user.code).json({
      status: user.status,
      id: user.registeredId,
      message: user.message,
    });
  } else {
    return res.status(user.code).json({
      status: user.status,
      message: user.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const { username, password } = req.body;

  const user = await loginUserDB(username, password);
  if (user.status === true) {
    const sessionToken = jwt.sign(
      {
        username: user.data.username,
        userId: user.data.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(user.code).json({
      status: user.status,
      token: sessionToken,
      message: user.message,
    });
  } else {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.user.userId;
  const data = await selectUserById(userId);

  if (data.status === true) {
    return res
      .status(data.code)
      .json({ status: data.status, data: data.data, message: data.message });
  } else {
    return res
      .status(data.code)
      .json({ status: data.status, message: data.message });
  }
};

export const updatePassword = async (req, res) => {
  const userId = req.user.userId;
  const { error } = updatePasswordSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const { password, newpassword } = req.body;

  const user = await changePassword(userId, password, newpassword);
  if (user.status === true) {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  } else {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  }
};

export const updateEmail = async (req, res) => {
  const userId = req.user.userId;
  const { error } = updateEmailSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const { newemail } = req.body;

  const user = await changeEmail(userId, newemail);
  if (user.status === true) {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  } else {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  }
};

export const updateUsername = async (req, res) => {
  const userId = req.user.userId;
  const { error } = updateUsernameSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const { newusername } = req.body;

  const user = await changeUsername(userId, newusername);
  if (user.status === true) {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  } else {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  }
};

export const updateUserType = async (req, res) => {
  const userId = req.user.userId;

  const user = await changeUserType(userId);
  if (user.status === true) {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  } else {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  }
};

export const deleteUserAccount = async (req, res) => {
  const userId = req.user.userId;

  const user = await changeUserDeleteType(userId);
  if (user.status === true) {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  } else {
    return res
      .status(user.code)
      .json({ status: user.status, message: user.message });
  }
};
