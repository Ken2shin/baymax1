import express from "express"
import * as consultController from "../controllers/consult.controller.js"
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js"

const router = express.Router()

/**
 * @swagger
 * /consult:
 *   post:
 *     summary: Create medical consultation
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Consultation created
 */
router.post("/", authenticate, consultController.createConsult)

/**
 * @swagger
 * /consult/{userId}:
 *   get:
 *     summary: Get consultations by user ID
 *     tags: [Consultations]
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
 *         description: User consultations
 */
router.get("/:userId", authenticate, consultController.getConsultsByUserId)

/**
 * @swagger
 * /consult/{id}:
 *   delete:
 *     summary: Delete consultation (admin only)
 *     tags: [Consultations]
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
 *         description: Consultation deleted
 */
router.delete("/:id", authenticate, authorizeAdmin, consultController.deleteConsult)

export default router
