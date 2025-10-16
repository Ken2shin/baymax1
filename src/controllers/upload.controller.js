import * as uploadService from "../services/upload.service.js"

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" })
    }

    const { title, description, category, tags } = req.body
    const { uid } = req.user

    const fileUrl = await uploadService.uploadFileToStorage(req.file)

    const uploadMetadata = await uploadService.createUploadMetadata({
      adminId: uid,
      title,
      description,
      fileUrl,
      category,
      tags: tags ? JSON.parse(tags) : [],
    })

    res.status(201).json(uploadMetadata)
  } catch (error) {
    console.error("Upload file error:", error)
    res.status(500).json({ error: "Failed to upload file" })
  }
}

export const getAllUploads = async (req, res) => {
  try {
    const uploads = await uploadService.getAllUploads()
    res.json(uploads)
  } catch (error) {
    console.error("Get uploads error:", error)
    res.status(500).json({ error: "Failed to get uploads" })
  }
}

export const getUploadById = async (req, res) => {
  try {
    const { id } = req.params
    const upload = await uploadService.getUploadById(id)

    if (!upload) {
      return res.status(404).json({ error: "Upload not found" })
    }

    res.json(upload)
  } catch (error) {
    console.error("Get upload error:", error)
    res.status(500).json({ error: "Failed to get upload" })
  }
}

export const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params
    await uploadService.deleteUpload(id)
    res.json({ message: "Upload deleted successfully" })
  } catch (error) {
    console.error("Delete upload error:", error)
    res.status(500).json({ error: "Failed to delete upload" })
  }
}
