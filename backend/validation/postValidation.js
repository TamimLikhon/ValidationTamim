import Joi from "joi";
const schemas = {
  PostSchema: Joi.object({
	Title: Joi.string().min(3).max(60).required(),
	Description: Joi.string().min(3).max(600).required(),
	userId: Joi.string().required(),
  }),
};

export default schemas;
