import Joi from "joi"

export const createConsultSchema = Joi.object({
  symptoms: Joi.array().items(Joi.string()).min(1).required(),
})
