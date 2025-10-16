import * as medicalRecordService from "../services/medicalRecord.service.js"
import { createMedicalRecordSchema, updateMedicalRecordSchema } from "../validators/medicalRecord.validator.js"

export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await medicalRecordService.getAllMedicalRecords()
    res.json(records)
  } catch (error) {
    console.error("Get all records error:", error)
    res.status(500).json({ error: "Failed to get medical records" })
  }
}

export const getMedicalRecordsByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const records = await medicalRecordService.getMedicalRecordsByUserId(userId)
    res.json(records)
  } catch (error) {
    console.error("Get records by user error:", error)
    res.status(500).json({ error: "Failed to get medical records" })
  }
}

export const createMedicalRecord = async (req, res) => {
  try {
    const { error, value } = createMedicalRecordSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const record = await medicalRecordService.createMedicalRecord(value)
    res.status(201).json(record)
  } catch (error) {
    console.error("Create record error:", error)
    res.status(500).json({ error: "Failed to create medical record" })
  }
}

export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = updateMedicalRecordSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const record = await medicalRecordService.updateMedicalRecord(id, value)
    res.json(record)
  } catch (error) {
    console.error("Update record error:", error)
    res.status(500).json({ error: "Failed to update medical record" })
  }
}

export const deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params
    await medicalRecordService.deleteMedicalRecord(id)
    res.json({ message: "Medical record deleted successfully" })
  } catch (error) {
    console.error("Delete record error:", error)
    res.status(500).json({ error: "Failed to delete medical record" })
  }
}
