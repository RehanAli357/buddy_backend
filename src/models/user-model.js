import bcrypt from "bcryptjs";
import { createResponse } from "../utils/create-response.js";
import { query, userQueryById, userQueryByUsername } from "./utils.js";
import { omitFields } from "../utils/omitFields.js";

// CREATE COMMAND
// Use this when you want to create a user table
// export const createUserTable = async () => {
//   try {
//     await query(`CREATE TABLE IF NOT EXISTS users (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       username VARCHAR(100) NOT NULL UNIQUE,
//       firstname VARCHAR(100) NOT NULL,
//       lastname VARCHAR(100) NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       usertype ENUM('free', 'premium') NOT NULL DEFAULT 'free',
//       email VARCHAR(100) NOT NULL UNIQUE,
//       createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//       deleted TINYINT(1) NOT NULL DEFAULT 0
//     )`,[]);
//     console.log("✅ Table 'users' is ready");
//   } catch (err) {
//     console.log(err.message);
//   }
// };

// INSERT COMMAND

export const insertUser = async (
  username,
  firstname,
  lastname,
  password,
  usertype,
  email
) => {
  try {
    const query = `
    INSERT INTO users (username, firstname, lastname, password, usertype, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
    const hashPassword = await bcrypt.hash(password, 10);

    const [result] = await query(query, [
      username,
      firstname,
      lastname,
      hashPassword,
      usertype,
      email,
    ]);
    return createResponse(true, "User Registered", 200, {
      registeredId: result.insertId,
    });
  } catch (error) {
    console.log("User Not Registered", error.message);
    return createResponse(false, "Error, User not registered", 500);
  }
};

export const selectUsers = async () => {
  try {
    const [row] = await query("SELECT * FROM users", []);
    console.log(row);
  } catch (error) {
    console.log("Error selecting user:", error.message);
  }
};

export const selectUserById = async (userId) => {
  try {
    const [row] = await userQueryById([userId]);

    if (row.length > 0) {
      const filteredData = omitFields(row[0], ["password", "deleted"]);
      return createResponse(true, "User found", 200, filteredData);
    } else {
      return createResponse(false, "User not found", 404);
    }
  } catch (error) {
    console.log("Error selecting user:", error.message);
    return createResponse(false, "Error in finding user", 500);
  }
};

export const loginUserDB = async (username, password) => {
  try {
    const [user] = await userQueryByUsername([username]);

    if (user.length > 0) {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        const filteredData = omitFields(row[0], ["password", "deleted"]);

        return createResponse(true, "User Found", 200, filteredData);
      } else {
        return createResponse(false, "invalid credential", 401);
      }
    } else {
      return createResponse(false, "No user found", 400);
    }
  } catch (error) {
    console.log("Error finding user:", error.message);
    return createResponse(500, "Error in finding user", 500);
  }
};

export const changePassword = async (userId, password, newpassword) => {
  try {
    const [user] = await userQueryById([userId]);

    if (user.length > 0) {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        const newHashPassword = await bcrypt.hash(newpassword, 10);
        const [result] = await query(
          `UPDATE users SET password = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ?  AND deleted = 0`,
          [newHashPassword, userId]
        );
        if (result.affectedRows > 0) {
          return createResponse(true, "User password updated", 200);
        } else {
          return createResponse(false, "Unable to update the password", 500);
        }
      } else {
        return createResponse(false, "Invalid credentials", 401);
      }
    } else {
      return createResponse(false, "No user found", 404);
    }
  } catch (error) {
    console.log("❌ Error in changing user password:", error.message);
    return createResponse(false, "Error in changing user password", 500);
  }
};

export const changeEmail = async (userId, newmail) => {
  try {
    const [user] = await userQueryById([userId]);

    if (user.length > 0) {
      const [result] = await query(
        `UPDATE users SET email = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ?  AND deleted = 0`,
        [newmail, userId]
      );
      if (result.affectedRows > 0) {
        return createResponse(true, "User Email updated");
      } else {
        return createResponse(false, "User email not updated", 500);
      }
    } else {
      return createResponse(false, "User not found", 404);
    }
  } catch (error) {
    console.log("Error in changing user Email", error.message);
    return createResponse(false, "Error in chaning user Email", 500);
  }
};

export const changeUsername = async (userId, newusername) => {
  try {
    const [user] = await userQueryById([userId]);

    if (user.length === 0) {
      return createResponse(false, "User not found", 404);
    }

    const [existing] = await userQueryByUsername([newusername]);

    if (existing.length > 0) {
      return createResponse(false, "Username already taken", 409);
    }

    const [result] = await query(
      `UPDATE users SET username = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ? AND deleted = 0`,
      [newusername, userId]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Username updated successfully for:", newusername);
      return createResponse(true, "Username updated", 200);
    } else {
      return createResponse(false, "Unable to update username", 500);
    }
  } catch (error) {
    console.log("❌ Error in changing username:", error.message);
    return createResponse(false, "Error in updating username", 500);
  }
};

export const changeUserType = async (userId) => {
  try {
    const [user] = await userQueryById([userId]);

    if (user.length === 0) {
      return createResponse(false, "User not found", 404);
    }

    const [result] = await query(
      `UPDATE users SET usertype = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ? AND deleted = 0`,
      ["premium", userId]
    );
    if (result.affectedRows > 0) {
      return createResponse(true, "USer has been upgraded", 200);
    } else {
      return createResponse(false, "Unable to upgrade user", 500);
    }
  } catch (error) {
    console.log("❌ Error in upgrading user:", error.message);
    return createResponse(false, "Error in upgrading user", 500);
  }
};

export const changeUserDeleteType = async (userId) => {
  try {
    const db = await getConnection();

    const [user] = await userQueryById([userId]);

    if (user.length === 0) {
      return createResponse(false, "USer not found", 404);
    }

    const [result] = await query(
      `UPDATE users SET deleted = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ? AND deleted = 0`,
      [1, userId]
    );
    if (result.affectedRows > 0) {
      return createResponse(true, "User account has been deleted");
    } else {
      return createResponse(false, "Unable to delete user account", 500);
    }
  } catch (error) {
    console.log("❌ Error in deleting user account:", error.message);
    return createResponse(false, "Error in deleting user account", 500);
  }
};
