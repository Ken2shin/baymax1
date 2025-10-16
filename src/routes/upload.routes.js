import express from "express"
import multer from "multer"
import * as uploadController from "../controllers/upload.controller.js"
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: Upload file (admin only)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       201:
 *         description: File uploaded
 */
router.post("/", authenticate, authorizeAdmin, upload.single("file"), uploadController.uploadFile)

/**
 * @swagger
 * /uploads:
 *   get:
 *     summary: Get all uploads
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploads
 */
router.get("/", authenticate, uploadController.getAllUploads)

/**
 * @swagger
 * /uploads/{id}:
 *   get:
 *     summary: Get upload by ID
 *     tags: [Uploads]
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
 *         description: Upload data
 */
router.get("/:id", authenticate, uploadController.getUploadById)

/**
 * @swagger
 * /uploads/{id}:
 *   delete:
 *     summary: Delete upload (admin only)
 *     tags: [Uploads]
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
 *         description: Upload deleted
 */
router.delete("/:id", authenticate, authorizeAdmin, uploadController.deleteUpload)

export default router
