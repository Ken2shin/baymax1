import express from "express"
import * as medicalRecordController from "../controllers/medicalRecord.controller.js"
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js"

const router = express.Router()

/**
 * @swagger
 * /medical_records:
 *   get:
 *     summary: Get all medical records (admin only)
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of medical records
 */
router.get("/", authenticate, authorizeAdmin, medicalRecordController.getAllMedicalRecords)

/**
 * @swagger
 * /medical_records/{userId}:
 *   get:
 *     summary: Get medical records by user ID
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User medical records
 */
router.get("/:userId", authenticate, medicalRecordController.getMedicalRecordsByUserId)

/**
 * @swagger
 * /medical_records:
 *   post:
 *     summary: Create medical record
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Medical record created
 */
router.post("/", authenticate, medicalRecordController.createMedicalRecord)

/**
 * @swagger
 * /medical_records/{id}:
 *   put:
 *     summary: Update medical record
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medical record updated
 */
router.put("/:id", authenticate, medicalRecordController.updateMedicalRecord)

/**
 * @swagger
 * /medical_records/{id}:
 *   delete:
 *     summary: Delete medical record
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medical record deleted
 */
router.delete("/:id", authenticate, medicalRecordController.deleteMedicalRecord)

export default router
