import Joi from "joi";

export const userIncomeSchema = Joi.object({
  monthlyIncome: Joi.number().required(),
});

export const userExpenseSchema = Joi.object({
  monthlyExpenses: Joi.number().required(),
});

export const userSavingSchema = Joi.object({
  monthlySavings: Joi.number().required(),
});

export const userRemaningSavingSchema = Joi.object({
  remainingSavings: Joi.number().required(),
});