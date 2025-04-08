import {
  createUserTable,
  insertUser,
  selectUsers,
  selectUserById,
  loginUser,
  changePassword,
  changeEmail,
  changeUsername,
} from "./user-model.js";

try {
  await createUserTable();
  //   console.log("✅ All tables created successfully.");
  //   await insertUser('rehanali','rehan','ali','Temp@123','free','user@email.com');
  //   await selectUsers();
  //   await selectUserById(1);
    // await loginUser("rehanali2", "Temp@1234");
  //   changePassword("rehanali", "Temp@123", "Temp@1234");
  //   await changeEmail('rehanali','Temp@1234','rehan@email.com');
  //   await changeUsername('rehanali2','Temp@1234','rehanali2');
} catch (error) {
  console.error("❌ Error initializing DB:", error.message);
}
