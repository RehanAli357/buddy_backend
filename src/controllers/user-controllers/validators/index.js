import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  firstname: Joi.string().min(3).max(30).required(),
  lastname: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  monthlyIncome:Joi.number().required(),
  monthlyExpenses:Joi.number().required(),
  monthlySavings:Joi.number().required(),
});


export const loginUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

export const updatePasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  newpassword: Joi.string().min(6).required(),
})

export const updateEmailSchema = Joi.object({
  newemail: Joi.string().email().required(),
})

export const updateUsernameSchema = Joi.object({
  newusername: Joi.string().min(3).max(30).required(),
})

export const authTokenUserSchema = Joi.object({
    authHeader: Joi.string().pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/).required(),
});

