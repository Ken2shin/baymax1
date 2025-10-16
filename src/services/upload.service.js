import { getFirestore, getStorage } from "../config/firebase.js"
import admin from "firebase-admin"

export const createUploadMetadata = async (uploadData) => {
  const db = getFirestore()
  const uploadRef = db.collection("uploads").doc()

  const newUpload = {
    adminId: uploadData.adminId,
    title: uploadData.title,
    description: uploadData.description || "",
    fileUrl: uploadData.fileUrl,
    uploadDate: admin.firestore.FieldValue.serverTimestamp(),
    category: uploadData.category || "general",
    tags: uploadData.tags || [],
  }

  await uploadRef.set(newUpload)
  return { id: uploadRef.id, ...newUpload }
}

export const uploadFileToStorage = async (file, folder = "uploads") => {
  const storage = getStorage()
  const bucket = storage.bucket()

  const fileName = `${folder}/${Date.now()}_${file.originalname}`
  const fileUpload = bucket.file(fileName)

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  })

  await fileUpload.makePublic()

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
  return publicUrl
}

export const getAllUploads = async () => {
  const db = getFirestore()
  const snapshot = await db.collection("uploads").orderBy("uploadDate", "desc").get()

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getUploadById = async (uploadId) => {
  const db = getFirestore()
  const uploadDoc = await db.collection("uploads").doc(uploadId).get()

  if (!uploadDoc.exists) {
    return null
  }

  return { id: uploadDoc.id, ...uploadDoc.data() }
}

export const deleteUpload = async (uploadId) => {
  const db = getFirestore()
  const uploadDoc = await db.collection("uploads").doc(uploadId).get()

  if (!uploadDoc.exists) {
    throw new Error("Upload not found")
  }

  const uploadData = uploadDoc.data()

  // Delete file from storage
  try {
    const storage = getStorage()
    const bucket = storage.bucket()
    const fileName = uploadData.fileUrl.split(`${bucket.name}/`)[1]
    await bucket.file(fileName).delete()
  } catch (error) {
    console.error("Error deleting file from storage:", error)
  }

  // Delete metadata from Firestore
  await db.collection("uploads").doc(uploadId).delete()
}
