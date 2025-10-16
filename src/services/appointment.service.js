import { getFirestore } from "../config/firebase.js"
import admin from "firebase-admin"

export const createAppointment = async (appointmentData) => {
  const db = getFirestore()
  const appointmentRef = db.collection("appointments").doc()

  const newAppointment = {
    ...appointmentData,
    date: admin.firestore.Timestamp.fromDate(new Date(appointmentData.date)),
    status: appointmentData.status || "pending",
    notes: appointmentData.notes || "",
  }

  await appointmentRef.set(newAppointment)
  return { id: appointmentRef.id, ...newAppointment }
}

export const getAppointmentById = async (appointmentId) => {
  const db = getFirestore()
  const appointmentDoc = await db.collection("appointments").doc(appointmentId).get()

  if (!appointmentDoc.exists) {
    return null
  }

  return { id: appointmentDoc.id, ...appointmentDoc.data() }
}

export const getAppointmentsByUserId = async (userId) => {
  const db = getFirestore()
  const snapshot = await db.collection("appointments").where("userId", "==", userId).orderBy("date", "desc").get()

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getAllAppointments = async () => {
  const db = getFirestore()
  const snapshot = await db.collection("appointments").orderBy("date", "desc").get()

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const updateAppointment = async (appointmentId, updateData) => {
  const db = getFirestore()
  const appointmentRef = db.collection("appointments").doc(appointmentId)

  const dataToUpdate = { ...updateData }

  if (updateData.date) {
    dataToUpdate.date = admin.firestore.Timestamp.fromDate(new Date(updateData.date))
  }

  await appointmentRef.update(dataToUpdate)

  const updatedDoc = await appointmentRef.get()
  return { id: updatedDoc.id, ...updatedDoc.data() }
}

export const deleteAppointment = async (appointmentId) => {
  const db = getFirestore()
  await db.collection("appointments").doc(appointmentId).delete()
}
