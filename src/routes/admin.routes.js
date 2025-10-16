import express from "express"
import * as adminController from "../controllers/admin.controller.js"
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js"

const router = express.Router()

/**
 * @swagger
 * /admin_data/{adminId}:
 *   get:
 *     summary: Get admin data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin data
 */
router.get("/:adminId", authenticate, authorizeAdmin, adminController.getAdminData)

/**
 * @swagger
 * /admin_data:
 *   post:
 *     summary: Create admin data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Admin data created
 */
router.post("/", authenticate, authorizeAdmin, adminController.createAdminData)

/**
 * @swagger
 * /admin_data/{id}:
 *   put:
 *     summary: Update admin data
 *     tags: [Admin]
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
 *         description: Admin data updated
 */
router.put("/:id", authenticate, authorizeAdmin, adminController.updateAdminData)

export default router
