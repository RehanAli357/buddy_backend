import { Router } from "express";

import {
  getUserFinanceById,
  updateUSerMonthlyExpense,
  updateUSerMonthlyIncome,
  updateUSerMonthlyRemainingSaving,
  updateUSerMonthlySaving,
} from "../controllers/user-finance-controllers/index.js";
import { userAuthTokenMiddleware } from "../middlewares/user-auth-middleware.js";

const route = Router();

route.get("", userAuthTokenMiddleware, getUserFinanceById);
route.patch("/update-income", userAuthTokenMiddleware, updateUSerMonthlyIncome);
route.patch("/update-expsenses", userAuthTokenMiddleware, updateUSerMonthlyExpense);
route.patch("/update-savings", userAuthTokenMiddleware, updateUSerMonthlySaving);
route.patch("/update-remaining-saving", userAuthTokenMiddleware, updateUSerMonthlyRemainingSaving);

export default route;
