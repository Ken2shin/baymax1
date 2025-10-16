import { getAuth, getFirestore } from "../config/firebase.js"

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await getAuth().verifyIdToken(token)

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    }

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ error: "Invalid or expired token" })
  }
}

export const authorizeAdmin = async (req, res, next) => {
  try {
    const { uid } = req.user
    const userDoc = await getFirestore().collection("users").doc(uid).get()

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" })
    }

    const userData = userDoc.data()

    if (userData.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" })
    }

    next()
  } catch (error) {
    console.error("Authorization error:", error)
    res.status(500).json({ error: "Authorization failed" })
  }
}
