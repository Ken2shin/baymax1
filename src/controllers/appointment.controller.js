import * as appointmentService from "../services/appointment.service.js"
import { createAppointmentSchema, updateAppointmentSchema } from "../validators/appointment.validator.js"

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments()
    res.json(appointments)
  } catch (error) {
    console.error("Get all appointments error:", error)
    res.status(500).json({ error: "Failed to get appointments" })
  }
}

export const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const appointments = await appointmentService.getAppointmentsByUserId(userId)
    res.json(appointments)
  } catch (error) {
    console.error("Get appointments by user error:", error)
    res.status(500).json({ error: "Failed to get appointments" })
  }
}

export const createAppointment = async (req, res) => {
  try {
    const { error, value } = createAppointmentSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const appointment = await appointmentService.createAppointment(value)
    res.status(201).json(appointment)
  } catch (error) {
    console.error("Create appointment error:", error)
    res.status(500).json({ error: "Failed to create appointment" })
  }
}

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = updateAppointmentSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const appointment = await appointmentService.updateAppointment(id, value)
    res.json(appointment)
  } catch (error) {
    console.error("Update appointment error:", error)
    res.status(500).json({ error: "Failed to update appointment" })
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params
    await appointmentService.deleteAppointment(id)
    res.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Delete appointment error:", error)
    res.status(500).json({ error: "Failed to delete appointment" })
  }
}
