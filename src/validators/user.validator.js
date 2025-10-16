import Joi from "joi"

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "user").default("user"),
  googleUid: Joi.string().required(),
  profileImage: Joi.string().uri().optional(),
  healthData: Joi.object({
    weight: Joi.number().optional(),
    height: Joi.number().optional(),
    bloodType: Joi.string().optional(),
    allergies: Joi.array().items(Joi.string()).optional(),
    chronicConditions: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  emergencyContacts: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        relation: Joi.string().required(),
        phone: Joi.string().required(),
      }),
    )
    .optional(),
  preferences: Joi.object({
    language: Joi.string().default("es"),
    notifications: Joi.boolean().default(true),
    darkMode: Joi.boolean().default(false),
  }).optional(),
})

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  profileImage: Joi.string().uri().optional(),
  healthData: Joi.object({
    weight: Joi.number().optional(),
    height: Joi.number().optional(),
    bloodType: Joi.string().optional(),
    allergies: Joi.array().items(Joi.string()).optional(),
    chronicConditions: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  emergencyContacts: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        relation: Joi.string().required(),
        phone: Joi.string().required(),
      }),
    )
    .optional(),
  preferences: Joi.object({
    language: Joi.string().optional(),
    notifications: Joi.boolean().optional(),
    darkMode: Joi.boolean().optional(),
  }).optional(),
})

export const updateMetricsSchema = Joi.object({
  heartRate: Joi.number().optional(),
  oxygenLevel: Joi.number().min(0).max(100).optional(),
  temperature: Joi.number().optional(),
  stressLevel: Joi.number().min(0).max(10).optional(),
})
