import admin from "firebase-admin"
import dotenv from "dotenv"

dotenv.config()

const firebaseConfig = {
  apiKey: "AIzaSyBhnDjWeFgVOqc1D7MjqktDOs_kJfxY3uI",
  authDomain: "baymax-9f462.firebaseapp.com",
  databaseURL: "https://baymax-9f462-default-rtdb.firebaseio.com",
  projectId: "baymax-9f462",
  storageBucket: "baymax-9f462.firebasestorage.app",
  messagingSenderId: "691229906621",
  appId: "1:691229906621:web:f47076cf679842417ec9d4",
  measurementId: "G-ZRVQGNJ7CM",
}

let db
let auth
let storage

export const initializeFirebase = () => {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : {
          projectId: firebaseConfig.projectId,
          // Note: For production, you need to add your service account JSON file
          // Download it from Firebase Console > Project Settings > Service Accounts
        }

    admin.initializeApp({
      credential: process.env.FIREBASE_SERVICE_ACCOUNT
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      databaseURL: firebaseConfig.databaseURL,
    })

    db = admin.firestore()
    auth = admin.auth()
    storage = admin.storage()

    console.log("✅ Firebase initialized successfully")
    console.log(`📦 Project: ${firebaseConfig.projectId}`)
  } catch (error) {
    console.error("❌ Firebase initialization error:", error)
    process.exit(1)
  }
}

export const getFirestore = () => {
  if (!db) throw new Error("Firestore not initialized")
  return db
}

export const getAuth = () => {
  if (!auth) throw new Error("Auth not initialized")
  return auth
}

export const getStorage = () => {
  if (!storage) throw new Error("Storage not initialized")
  return storage
}
