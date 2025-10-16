import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger.js"
import { initializeFirebase } from "./config/firebase.js"

// Routes
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import medicalRecordRoutes from "./routes/medicalRecord.routes.js"
import appointmentRoutes from "./routes/appointment.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import consultRoutes from "./routes/consult.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Initialize Firebase
initializeFirebase()

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Baymax Medical API is running" })
})

// Routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/medical_records", medicalRecordRoutes)
app.use("/appointments", appointmentRoutes)
app.use("/admin_data", adminRoutes)
app.use("/uploads", uploadRoutes)
app.use("/consult", consultRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      status: 404,
    },
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Baymax Medical API running on port ${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
})
