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
      updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    console.log("✅ User inserted successfully, ID:", result.insertId);
  } catch (error) {
    console.log("Error inserting user:", err.message);
  }
};

export const selectUsers = async () => {
  try {
    const db = await getConnection();
    const [row] = await db.execute("SELECT * FROM users");
    console.log(row);
  } catch (error) {
    console.log("Error selecting user:", err.message);
  }
};

export const selectUserById = async (id) => {
  try {
    const db = await getConnection();
    const [row] = await db.execute(`SELECT * FROM users where id=${id}`);
    if (row.length > 0) {
      console.log(row);
    } else {
      console.log("no data");
    }
  } catch (error) {
    console.log("Error selecting user:", err.message);
  }
};

export const loginUserDB = async (username, password) => {
  try {
    const db = await getConnection();
    const [user] = await db.execute(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);

    if (user.length > 0) {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        const { password, ...userWithoutPassword } = user[0];
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

export const changePassword = async (username, password, newpassword) => {
  try {
    const db = await getConnection();
    const [user] = await db.execute(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);

    if (user.length > 0) {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        const newHashPassword = await bcrypt.hash(newpassword, 10);
        const [result] = await db.execute(
          `UPDATE users SET password = ?, updatedat = CURRENT_TIMESTAMP WHERE username = ?`,
          [newHashPassword, username]
        );
        if (result.affectedRows > 0) {
          console.log("✅ Password updated successfully for:", username);
        } else {
          console.log("❌ Unable to update the password");
        }
      } else {
        console.log("❌ Invalid credentials");
      }
    } else {
      console.log("❌ No user found");
    }
  } catch (error) {
    console.log("❌ Error in changing user password:", error.message);
  }
};

export const changeEmail = async (username, password, newmail) => {
  try {
    const db = await getConnection();
    const [user] = await db.execute(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);

    if (user.length > 0) {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        const [result] = await db.execute(
          `UPDATE users SET email = ?, updatedat = CURRENT_TIMESTAMP WHERE username = ?`,
          [newmail, username]
        );
        if (result.affectedRows > 0) {
          console.log("✅ Email updated successfully for:", username);
        } else {
          console.log("❌ Unable to update the Email");
        }
      } else {
        console.log("❌ Invalid credentials");
      }
    } else {
      console.log("❌ No user found");
    }
  } catch (error) {
    console.log("❌ Error in changing user Email:", error.message);
  }
};

export const changeUsername = async (username, password, newusername) => {
  try {
    const db = await getConnection();

    const [user] = await db.execute(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);

    if (user.length === 0) {
      console.log("❌ No user found");
      return;
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      console.log("❌ Invalid credentials");
      return;
    }

    const [existing] = await db.execute(
      `SELECT * FROM users WHERE username = ?`,
      [newusername]
    );

    if (existing.length > 0) {
      console.log("❌ New username already taken");
      return;
    }

    const [result] = await db.execute(
      `UPDATE users SET username = ?, updatedat = CURRENT_TIMESTAMP WHERE username = ?`,
      [newusername, username]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Username updated successfully for:", newusername);
    } else {
      console.log("❌ Unable to update the username");
    }
  } catch (error) {
    console.log("❌ Error in changing username:", error.message);
  }
};
