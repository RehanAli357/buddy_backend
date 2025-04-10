import { getConnection } from "../../config/mysql-connetion.js";
import bcrypt from "bcryptjs";

// CREATE COMMAND

export const createUserTable = async () => {
  try {
    const db = await getConnection();

    await db.execute(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      firstname VARCHAR(100) NOT NULL,
      lastname VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      usertype ENUM('free', 'premium') NOT NULL DEFAULT 'free',
      email VARCHAR(100) NOT NULL UNIQUE,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted TINYINT(1) NOT NULL DEFAULT 0
    )`);
    console.log("✅ Table 'users' is ready");
  } catch (err) {
    console.log(err.message);
  }
};

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
    const db = await getConnection();

    const query = `
    INSERT INTO users (username, firstname, lastname, password, usertype, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
    const hashPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(query, [
      username,
      firstname,
      lastname,
      hashPassword,
      usertype,
      email,
    ]);
    return {
      status: true,
      message: "User Registered",
      registeredId: result.insertId,
      code: 200,
    };
  } catch (error) {
    console.log("User Not Registered", error.message);
    return {
      status: false,
      message: "User not  Registered",
      code: 500,
    };
  }
};

export const selectUsers = async () => {
  try {
    const db = await getConnection();
    const [row] = await db.execute("SELECT * FROM users");
    console.log(row);
  } catch (error) {
    console.log("Error selecting user:", error.message);
  }
};

export const selectUserById = async (id) => {
  try {
    const db = await getConnection();
    const [row] = await db.execute(`SELECT * FROM users WHERE id = ? AND deleted = 0`, [id]);
    if (row.length > 0) {
      const { password, deleted, ...userWithoutPassword } = row[0];

      return {
        status: true,
        message: "User found",
        data: userWithoutPassword,
        code: 200,
      };
    } else {
      return {
        status: false,
        message: "User not found",
        code: 404,
      };
    }
  } catch (error) {
    console.log("Error selecting user:", error.message);
    return {
      status: false,
      message: "Error in finding user",
      code: 500,
    };
  }
};

export const loginUserDB = async (username, password) => {
  try {
    const db = await getConnection();
    const [user] = await db.execute(`SELECT * FROM users WHERE username = ? AND deleted = 0`, [
      username,
    ]);

    if (user.length > 0) {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        const { password, deleted, ...userWithoutPassword } = user[0];
        return {
          status: true,
          message: "User found",
          data: userWithoutPassword,
          code: 200,
        };
      } else {
        return {
          status: false,
          message: "invalid credential",
          code: 401,
        };
      }
    } else {
      return {
        status: false,
        message: "No user found",
        code: 400,
      };
    }
  } catch (error) {
    console.log("Error finding user:", error.message);
    return {
      status: false,
      message: "Error in finding user from database",
      code: 500,
    };
  }
};

export const changePassword = async (userId, password, newpassword) => {
  try {
    const db = await getConnection();
    const [user] = await db.execute(`SELECT * FROM users WHERE id = ? AND deleted = 0`, [
      userId,
    ]);

    if (user.length > 0) {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        const newHashPassword = await bcrypt.hash(newpassword, 10);
        const [result] = await db.execute(
          `UPDATE users SET password = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ?`,
          [newHashPassword, userId]
        );
        if (result.affectedRows > 0) {
          return {
            status: true,
            message: "User Password updated",
            code: 200,
          };
        } else {
          return {
            status: false,
            message: "Unable to update the password",
            code: 500,
          };
        }
      } else {
        return {
          status: false,
          message: "Invalid credentials",
          code: 401,
        };
      }
    } else {
      return {
        status: false,
        message: "No user found",
        code: 404,
      };
    }
  } catch (error) {
    console.log("❌ Error in changing user password:", error.message);
    return {
      status: false,
      message: "Error in changing user password",
      code: 500,
    };
  }
};

export const changeEmail = async (userId, newmail) => {
  try {
    const db = await getConnection();
    const [user] = await db.execute(`SELECT * FROM users WHERE id = ? AND deleted = 0`, [
      userId,
    ]);

    if (user.length > 0) {
      const [result] = await db.execute(
        `UPDATE users SET email = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ?`,
        [newmail, userId]
      );
      if (result.affectedRows > 0) {
        return {
          status: true,
          message: "User Email updated",
          code: 200,
        };
      } else {
        return {
          status: false,
          message: "User Email not updated",
          code: 500,
        };
      }
    } else {
      return {
        status: false,
        message: "User Not found",
        code: 404,
      };
    }
  } catch (error) {
    console.log("Error in changing user Email", error.message);
    return {
      status: false,
      message: "Error in changing user Email",
      code: 500,
    };
  }
};

export const changeUsername = async (userId, newusername) => {
  try {
    const db = await getConnection();

    const [user] = await db.execute(`SELECT * FROM users WHERE id = ? AND deleted = 0`, [
      userId,
    ]);

    if (user.length === 0) {
      return {
        status: false,
        message: "User Not found",
        code: 404,
      };
    }

    const [existing] = await db.execute(
      `SELECT * FROM users WHERE username = ?`,
      [newusername]
    );

    if (existing.length > 0) {
      return {
        status: false,
        message: "Username already taken ",
        code: 409,
      };
    }

    const [result] = await db.execute(
      `UPDATE users SET username = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ?`,
      [newusername, userId]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Username updated successfully for:", newusername);
      return {
        status: true,
        message: "Username Updated",
        code: 200,
      };
    } else {
      return {
        status: false,
        message: "Unable to update Username",
        code: 500,
      };
    }
  } catch (error) {
    console.log("❌ Error in changing username:", error.message);
    return {
      status: false,
      message: " Error in updating username",
      code: 500,
    };
  }
};

export const changeUserType = async (userId) => {
  try {
    const db = await getConnection();

    const [user] = await db.execute(`SELECT * FROM users WHERE id = ? AND deleted = 0`, [
      userId,
    ]);

    if (user.length === 0) {
      return {
        status: false,
        message: "User Not found",
        code: 404,
      };
    }

    const [result] = await db.execute(
      `UPDATE users SET usertype = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ?`,
      ["premium", userId]
    );
    if (result.affectedRows > 0) {
      return {
        status: true,
        message: "User has been upgraded",
        code: 200,
      };
    } else {
      return {
        status: false,
        message: "Unable to upgrade user",
        code: 500,
      };
    }
  } catch (error) {
    console.log("❌ Error in upgrading user:", error.message);
    return {
      status: false,
      message: "Error in upgrading user",
      code: 500,
    };
  }
};


export const changeUserDeleteType = async (userId) => {
  try {
    const db = await getConnection();

    const [user] = await db.execute(`SELECT * FROM users WHERE id = ? AND deleted = 0`, [
      userId,
    ]);

    if (user.length === 0) {
      return {
        status: false,
        message: "User Not found",
        code: 404,
      };
    }

    const [result] = await db.execute(
      `UPDATE users SET deleted = ?, updatedat = CURRENT_TIMESTAMP WHERE id = ?`,
      [1, userId]
    );
    if (result.affectedRows > 0) {
      return {
        status: true,
        message: "User account has been deleted",
        code: 200,
      };
    } else {
      return {
        status: false,
        message: "Unable to deleted user account",
        code: 500,
      };
    }
  } catch (error) {
    console.log("❌ Error in deleting user account:", error.message);
    return {
      status: false,
      message: "Error in deleting user account",
      code: 500,
    };
  }
};
