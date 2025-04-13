import { createResponse } from "../utils/create-response.js";
import { query } from "./utils.js";

// CREATE COMMAND
// Use this when you want to create a user finance table
// export const createUserFinanceTable = async () => {
//   try {
//     await query(
//       `CREATE TABLE IF NOT EXISTS finance (
//           fid INT AUTO_INCREMENT PRIMARY KEY,
//           uid INT NOT NULL,
//           monthlyIncome INT NOT NULL,
//           monthlyExpenses INT NOT NULL,
//           monthlySavings INT NOT NULL,
//           remainingSavings INT NOT NULL,
//           createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//           FOREIGN KEY (uid) REFERENCES users(id)
//         )`,
//       []
//     );
//     console.log("✅ Table 'finance' is ready");
//     return{
//         data:true
//     }
//   } catch (err) {
//     console.log("❌ Error creating 'finance' table:", err.message);
//     return{ data:false}
//   }
// };

export const insertUserFinance = async (
  uid,
  monthlyIncome,
  monthlyExpenses,
  monthlySavings
) => {
  try {
    const [userFinance] = await query(
      `
        INSERT INTO finance (uid, monthlyIncome, monthlyExpenses, monthlySavings, remainingSavings)
        VALUES (?, ?, ?, ?, ?)
      `,
      [uid, monthlyIncome, monthlyExpenses, monthlySavings, monthlySavings]
    );
    return createResponse(true, "User finance Registered", 200, {
      registeredId: userFinance.insertId,
    });
  } catch (error) {
    console.log("❌ Error inserting user finance details:", error.message);
    return createResponse(false, "Error inserting user finance details", 500);
  }
};

export const selectUserFinanceById = async (uid) => {
  try {
    const [data] = await query(`SELECT * FROM finance WHERE uid = ?`, [uid]);
    if (data.length > 0) {
      return createResponse(true, "User finance found", 200, data[0]);
    } else {
      return createResponse(false, "User finance not found", 404);
    }
  } catch (error) {
    console.log("Error in finding User finance:", error.message);
    return createResponse(false, "Error in finding User finance", 500);
  }
};

export const changeUserIncome = async (uid, monthlyIncome) => {
  try {
    const [data] = await query(
      `UPDATE finance SET monthlyIncome = ?, updatedat = CURRENT_TIMESTAMP WHERE uid = ? `,
      [monthlyIncome, uid]
    );
    if (data.affectedRows > 0) {
      return createResponse(true, "monthly income updated", 200);
    } else {
      return createResponse(false, "Unable to update monthly income", 500);
    }
  } catch (error) {
    console.log("❌ Error in changing monthly income:", error.message);
    return createResponse(false, "Error in updating monthly income", 500);
  }
};

export const changeUserExpenses = async (uid, monthlyExpenses) => {
  try {
    const [data] = await query(
      `UPDATE finance SET monthlyExpenses = ?, updatedat = CURRENT_TIMESTAMP WHERE uid = ? `,
      [monthlyExpenses, uid]
    );
    if (data.affectedRows > 0) {
      return createResponse(true, "monthly expenses updated", 200);
    } else {
      return createResponse(false, "Unable to update monthly expenses", 500);
    }
  } catch (error) {
    console.log("❌ Error in changing monthly expenses:", error.message);
    return createResponse(false, "Error in updating monthly expenses", 500);
  }
};

export const changeUserSavings = async (uid, monthlySavings) => {
  try {
    const [data] = await query(
      `UPDATE finance SET monthlySavings = ?, updatedat = CURRENT_TIMESTAMP WHERE uid = ? `,
      [monthlySavings, uid]
    );
    if (data.affectedRows > 0) {
      return createResponse(true, "monthly savings updated", 200);
    } else {
      return createResponse(false, "Unable to update monthly savings", 500);
    }
  } catch (error) {
    console.log("❌ Error in changing monthly savings:", error.message);
    return createResponse(false, "Error in updating monthly savings", 500);
  }
};

export const changeUserRemaningSavings = async (uid, remainingSavings) => {
  try {
    const [data] = await query(
      `UPDATE finance SET remainingSavings = ?, updatedat = CURRENT_TIMESTAMP WHERE uid = ? `,
      [remainingSavings, uid]
    );
    if (data.affectedRows > 0) {
      return createResponse(true, "monthly remaining savings updated", 200);
    } else {
      return createResponse(false, "Unable to update monthly remaining savings", 500);
    }
  } catch (error) {
    console.log("❌ Error in changing monthly remaining savings:", error.message);
    return createResponse(false, "Error in updating monthly remaining savings", 500);
  }
};