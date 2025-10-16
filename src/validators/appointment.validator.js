import Joi from "joi"

export const createAppointmentSchema = Joi.object({
  userId: Joi.string().required(),
  doctor: Joi.string().required(),
  department: Joi.string().required(),
  date: Joi.date().iso().required(),
  status: Joi.string().valid("pending", "completed", "cancelled").default("pending"),
  notes: Joi.string().optional(),
})

export const updateAppointmentSchema = Joi.object({
  doctor: Joi.string().optional(),
  department: Joi.string().optional(),
  date: Joi.date().iso().optional(),
  status: Joi.string().valid("pending", "completed", "cancelled").optional(),
  notes: Joi.string().optional(),
})
