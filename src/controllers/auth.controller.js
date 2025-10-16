import { getAuth } from "../config/firebase.js"
import * as userService from "../services/user.service.js"

export const loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return res.status(400).json({ error: "ID token is required" })
    }

    const decodedToken = await getAuth().verifyIdToken(idToken)
    const { uid, email, name, picture } = decodedToken

    let user = await userService.getUserByGoogleUid(uid)

    if (!user) {
      user = await userService.createUser({
        name: name || email.split("@")[0],
        email,
        googleUid: uid,
        profileImage: picture || "",
        role: "user",
      })
    } else {
      await userService.updateLastLogin(user.id)
    }

    res.json({
      message: "Login successful",
      user,
      token: idToken,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(401).json({ error: "Authentication failed" })
  }
}

export const getMe = async (req, res) => {
  try {
    const { uid } = req.user
    const user = await userService.getUserByGoogleUid(uid)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get me error:", error)
    res.status(500).json({ error: "Failed to get user data" })
  }
}

export const logout = async (req, res) => {
  try {
    res.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ error: "Logout failed" })
  }
}

export const generateTestToken = async (req, res) => {
  try {
    const { email = "test@example.com", role = "user" } = req.body

    // Check if we're in development mode
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        error: "Test tokens are only available in development mode",
      })
    }

    // Create a test user ID
    const testUid = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create custom token
    const customToken = await getAuth().createCustomToken(testUid, {
      email,
      role,
      name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    })

    // Exchange custom token for ID token (this would normally be done on client)
    // For testing purposes, we'll return instructions
    res.json({
      message: "Token generado exitosamente",
      customToken,
      instructions: {
        es: "Usa este token en el campo 'Value' de Swagger. Si no funciona, necesitas intercambiarlo por un ID token usando Firebase Auth.",
        en: "Use this token in the 'Value' field in Swagger. If it doesn't work, you need to exchange it for an ID token using Firebase Auth.",
      },
      testUser: {
        uid: testUid,
        email,
        role,
      },
      note: "Para Swagger, copia el 'customToken' y pégalo en el campo de autorización Bearer",
    })
  } catch (error) {
    console.error("Generate test token error:", error)
    res.status(500).json({
      error: "Failed to generate test token",
      details: error.message,
    })
  }
}
