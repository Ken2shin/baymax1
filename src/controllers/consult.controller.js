import * as consultService from "../services/consult.service.js"
import { createConsultSchema } from "../validators/consult.validator.js"

export const createConsult = async (req, res) => {
  try {
    const { error, value } = createConsultSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { uid } = req.user
    const consult = await consultService.createConsult(uid, value.symptoms)

    res.status(201).json(consult)
  } catch (error) {
    console.error("Create consult error:", error)
    res.status(500).json({ error: "Failed to create consult" })
  }
}

export const getConsultsByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const consults = await consultService.getConsultsByUserId(userId)
    res.json(consults)
  } catch (error) {
    console.error("Get consults error:", error)
    res.status(500).json({ error: "Failed to get consults" })
  }
}

export const deleteConsult = async (req, res) => {
  try {
    const { id } = req.params
    await consultService.deleteConsult(id)
    res.json({ message: "Consult deleted successfully" })
  } catch (error) {
    console.error("Delete consult error:", error)
    res.status(500).json({ error: "Failed to delete consult" })
  }
}
