import Joi from "joi";
import { create } from "moongose/models/user_model";
const schemas = {
  registerSchema: Joi.object({
    name: Joi.string().min(3).max(31).required(),
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .message("Only Gmail addresses are allowed")
      .required(),

    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,31}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain lowercase, uppercase, 0-9, and special character",
        "string.empty": "Password is required",
      }),
    confpass: Joi.required().valid(Joi.ref("password")),
  }),

  loginSchema: Joi.object({
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .message("Only Gmail addresses are allowed")
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,31}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain lowercase, uppercase, 0-9, and special character",
        "string.empty": "Password is required",
      }),
  }),



  forgetPassword: Joi.object({
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .message("Only Gmail addresses are allowed")
      .required()
      
  }),

    updatePassword: Joi.object({
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .message("Only Gmail addresses are allowed")
      .required(),
    verificationCode: Joi.string().required().messages({
      "string.empty": "Verification code is required",
    }),
    newPassword: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,31}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain lowercase, uppercase, 0-9, and special character",
        "string.empty": "New password is required",
      }),
  }),
  verifiedAccount: Joi.object({
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .message("Only Gmail addresses are allowed")
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,31}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain lowercase, uppercase, 0-9, and special character",
        "string.empty": "Password is required",
      }),
  }),
  verifyAccountSchema: Joi.object({
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .message("Only Gmail addresses are allowed")
      .required(),
    verificationCode: Joi.string().required().messages({
      "string.empty": "Verification code is required",
    }),
  }),
   PostSchema: Joi.object({
    Title: Joi.string().min(3).max(60).required(),
    Description: Joi.string().min(3).max(600).required(),
    })
};

export default schemas;
