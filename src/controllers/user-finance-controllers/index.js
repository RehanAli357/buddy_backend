import {
    changeUserExpenses,
  changeUserIncome,
  changeUserRemaningSavings,
  changeUserSavings,
  selectUserFinanceById,
} from "../../models/user-finence.js";
import { userExpenseSchema, userIncomeSchema, userRemaningSavingSchema, userSavingSchema } from "./validators/index.js";

export const getUserFinanceById = async (req, res) => {
  const userId = req.user.userId;
  const data = await selectUserFinanceById(userId);

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

export const updateUSerMonthlyIncome = async (req, res) => {
  const userId = req.user.userId;
  const { error } = userIncomeSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }
  const { monthlyIncome } = req.body;

  const data = await changeUserIncome(userId, monthlyIncome);

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

export const updateUSerMonthlyExpense = async (req, res) => {
  const userId = req.user.userId;
  const { error } = userExpenseSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }
  const { monthlyExpenses } = req.body;

  const data = await changeUserExpenses(userId, monthlyExpenses);

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

export const updateUSerMonthlySaving = async (req, res) => {
  const userId = req.user.userId;
  const { error } = userSavingSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }
  const { monthlySavings } = req.body;

  const data = await changeUserSavings(userId, monthlySavings);

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

export const updateUSerMonthlyRemainingSaving = async (req, res) => {
    const userId = req.user.userId;
    const { error } = userRemaningSavingSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }
    const { remainingSavings } = req.body;
  
    const data = await changeUserRemaningSavings(userId, remainingSavings);
  
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