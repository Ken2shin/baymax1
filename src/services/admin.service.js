import { getFirestore } from "../config/firebase.js"
import admin from "firebase-admin"

export const createAdminData = async (adminData) => {
  const db = getFirestore()
  const adminRef = db.collection("admin_data").doc()

  const newAdmin = {
    googleUid: adminData.googleUid,
    permissions: {
      canUpload: adminData.permissions?.canUpload || false,
      canEditUsers: adminData.permissions?.canEditUsers || false,
      canViewStats: adminData.permissions?.canViewStats || false,
    },
    activityLog: [],
  }

  await adminRef.set(newAdmin)
  return { id: adminRef.id, ...newAdmin }
}

export const getAdminDataById = async (adminId) => {
  const db = getFirestore()
  const adminDoc = await db.collection("admin_data").doc(adminId).get()

  if (!adminDoc.exists) {
    return null
  }

  return { id: adminDoc.id, ...adminDoc.data() }
}

export const updateAdminData = async (adminId, updateData) => {
  const db = getFirestore()
  const adminRef = db.collection("admin_data").doc(adminId)

  await adminRef.update(updateData)

  const updatedDoc = await adminRef.get()
  return { id: updatedDoc.id, ...updatedDoc.data() }
}

export const logAdminActivity = async (adminId, action, target) => {
  const db = getFirestore()
  const adminRef = db.collection("admin_data").doc(adminId)

  await adminRef.update({
    activityLog: admin.firestore.FieldValue.arrayUnion({
      action,
      target,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    }),
  })
}
