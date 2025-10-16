import * as adminService from "../services/admin.service.js"

export const getAdminData = async (req, res) => {
  try {
    const { adminId } = req.params
    const adminData = await adminService.getAdminDataById(adminId)

    if (!adminData) {
      return res.status(404).json({ error: "Admin data not found" })
    }

    res.json(adminData)
  } catch (error) {
    console.error("Get admin data error:", error)
    res.status(500).json({ error: "Failed to get admin data" })
  }
}

export const createAdminData = async (req, res) => {
  try {
    const adminData = await adminService.createAdminData(req.body)
    res.status(201).json(adminData)
  } catch (error) {
    console.error("Create admin data error:", error)
    res.status(500).json({ error: "Failed to create admin data" })
  }
}

export const updateAdminData = async (req, res) => {
  try {
    const { id } = req.params
    const adminData = await adminService.updateAdminData(id, req.body)
    res.json(adminData)
  } catch (error) {
    console.error("Update admin data error:", error)
    res.status(500).json({ error: "Failed to update admin data" })
  }
}
