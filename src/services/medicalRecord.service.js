import { getFirestore } from "../config/firebase.js"
import admin from "firebase-admin"

export const createMedicalRecord = async (recordData) => {
  const db = getFirestore()
  const recordRef = db.collection("medical_records").doc()

  const newRecord = {
    ...recordData,
    visitDate: admin.firestore.Timestamp.fromDate(new Date(recordData.visitDate)),
    nextAppointment: recordData.nextAppointment
      ? admin.firestore.Timestamp.fromDate(new Date(recordData.nextAppointment))
      : null,
    prescriptions: recordData.prescriptions || [],
    labResults: recordData.labResults || [],
  }

  await recordRef.set(newRecord)
  return { id: recordRef.id, ...newRecord }
}

export const getMedicalRecordById = async (recordId) => {
  const db = getFirestore()
  const recordDoc = await db.collection("medical_records").doc(recordId).get()

  if (!recordDoc.exists) {
    return null
  }

  return { id: recordDoc.id, ...recordDoc.data() }
}

export const getMedicalRecordsByUserId = async (userId) => {
  const db = getFirestore()
  const snapshot = await db
    .collection("medical_records")
    .where("userId", "==", userId)
    .orderBy("visitDate", "desc")
    .get()

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getAllMedicalRecords = async () => {
  const db = getFirestore()
  const snapshot = await db.collection("medical_records").orderBy("visitDate", "desc").get()

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const updateMedicalRecord = async (recordId, updateData) => {
  const db = getFirestore()
  const recordRef = db.collection("medical_records").doc(recordId)

  const dataToUpdate = { ...updateData }

  if (updateData.visitDate) {
    dataToUpdate.visitDate = admin.firestore.Timestamp.fromDate(new Date(updateData.visitDate))
  }

  if (updateData.nextAppointment) {
    dataToUpdate.nextAppointment = admin.firestore.Timestamp.fromDate(new Date(updateData.nextAppointment))
  }

  await recordRef.update(dataToUpdate)

  const updatedDoc = await recordRef.get()
  return { id: updatedDoc.id, ...updatedDoc.data() }
}

export const deleteMedicalRecord = async (recordId) => {
  const db = getFirestore()
  await db.collection("medical_records").doc(recordId).delete()
}
