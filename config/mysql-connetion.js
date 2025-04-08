import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const getConnection = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    console.log("✅ DB connected to", process.env.DB_DATABASE);
    return db;
  } catch (err) {
    console.error("❌ DB connection error:", err.message,process.env.DB_HOST);
    throw err;
  }
};
