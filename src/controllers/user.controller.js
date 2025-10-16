import * as userService from "../services/user.service.js"
import { createUserSchema, updateUserSchema, updateMetricsSchema } from "../validators/user.validator.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers()
    res.json(users)
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({ error: "Failed to get users" })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await userService.getUserById(id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Failed to get user" })
  }
}

export const createUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const user = await userService.createUser(value)
    res.status(201).json(user)
  } catch (error) {
    console.error("Create user error:", error)
    res.status(500).json({ error: "Failed to create user" })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = updateUserSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const user = await userService.updateUser(id, value)
    res.json(user)
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ error: "Failed to update user" })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await userService.deleteUser(id)
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ error: "Failed to delete user" })
  }
}

export const getUserMetrics = async (req, res) => {
  try {
    const { id } = req.params
    const user = await userService.getUserById(id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user.metrics || {})
  } catch (error) {
    console.error("Get metrics error:", error)
    res.status(500).json({ error: "Failed to get metrics" })
  }
}

export const updateUserMetrics = async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = updateMetricsSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const user = await userService.updateUserMetrics(id, value)
    res.json(user.metrics)
  } catch (error) {
    console.error("Update metrics error:", error)
    res.status(500).json({ error: "Failed to update metrics" })
  }
}
