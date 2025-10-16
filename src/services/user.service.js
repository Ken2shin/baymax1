import { getFirestore } from "../config/firebase.js"
import admin from "firebase-admin"

export const createUser = async (userData) => {
  const db = getFirestore()
  const userRef = db.collection("users").doc()

  const newUser = {
    ...userData,
    dateCreated: admin.firestore.FieldValue.serverTimestamp(),
    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    healthData: userData.healthData || {},
    emergencyContacts: userData.emergencyContacts || [],
    preferences: {
      language: "es",
      notifications: true,
      darkMode: false,
      ...userData.preferences,
    },
    metrics: {
      heartRate: 0,
      oxygenLevel: 0,
      temperature: 0,
      stressLevel: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    },
  }

  await userRef.set(newUser)
  return { id: userRef.id, ...newUser }
}

export const getUserById = async (userId) => {
  const db = getFirestore()
  const userDoc = await db.collection("users").doc(userId).get()

  if (!userDoc.exists) {
    return null
  }

  return { id: userDoc.id, ...userDoc.data() }
}

export const getUserByGoogleUid = async (googleUid) => {
  const db = getFirestore()
  const snapshot = await db.collection("users").where("googleUid", "==", googleUid).limit(1).get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() }
}

export const getAllUsers = async () => {
  const db = getFirestore()
  const snapshot = await db.collection("users").get()

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const updateUser = async (userId, updateData) => {
  const db = getFirestore()
  const userRef = db.collection("users").doc(userId)

  await userRef.update(updateData)

  const updatedDoc = await userRef.get()
  return { id: updatedDoc.id, ...updatedDoc.data() }
}

export const deleteUser = async (userId) => {
  const db = getFirestore()
  await db.collection("users").doc(userId).delete()
}

export const updateUserMetrics = async (userId, metricsData) => {
  const db = getFirestore()
  const userRef = db.collection("users").doc(userId)

  await userRef.update({
    metrics: {
      ...metricsData,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    },
  })

  const updatedDoc = await userRef.get()
  return { id: updatedDoc.id, ...updatedDoc.data() }
}

export const updateLastLogin = async (userId) => {
  const db = getFirestore()
  await db.collection("users").doc(userId).update({
    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
  })
}
