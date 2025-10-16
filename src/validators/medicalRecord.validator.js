import Joi from "joi"

export const createMedicalRecordSchema = Joi.object({
  userId: Joi.string().required(),
  doctorName: Joi.string().required(),
  diagnosis: Joi.string().required(),
  prescriptions: Joi.array().items(Joi.string()).optional(),
  labResults: Joi.array().items(Joi.string()).optional(),
  visitDate: Joi.date().iso().required(),
  nextAppointment: Joi.date().iso().optional(),
})

export const updateMedicalRecordSchema = Joi.object({
  doctorName: Joi.string().optional(),
  diagnosis: Joi.string().optional(),
  prescriptions: Joi.array().items(Joi.string()).optional(),
  labResults: Joi.array().items(Joi.string()).optional(),
  visitDate: Joi.date().iso().optional(),
  nextAppointment: Joi.date().iso().optional(),
})
