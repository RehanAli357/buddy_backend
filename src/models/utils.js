import { getConnection } from "../../config/mysql-connetion.js";

export const query = async (sql, params = []) => {
  const db = await getConnection();
  return db.execute(sql, params);
};

export const userQueryById = async ([userId]) => {
  const db = await getConnection();
  return db.execute(`SELECT * FROM users WHERE id = ? AND deleted = 0`, [
    userId,
  ]);
};

export const userQueryByUsername = async ([username]) => {
    const db = await getConnection();
    return db.execute(`SELECT * FROM users WHERE username = ? AND deleted = 0`, [
      username,
    ]);
  };
  