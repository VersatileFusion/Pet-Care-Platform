import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { verifyToken, requireAuth } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { serviceValidation } from "../validations/service.validation";
import { apiLimiter } from "../middleware/rate-limit.middleware";
import { upload } from "../utils/file-upload";

const router = Router();
const serviceController = new ServiceController();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management endpoints
 */

// Apply rate limiter to all service routes
router.use(apiLimiter);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [general_care, boarding, grooming, daycare, training, vet_visit]
 *         description: Filter by service type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *         description: Filter by service status
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Paginated list of services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get("/", serviceController.getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 */
router.get("/:id", serviceController.getService);

// Protected routes
router.use(verifyToken);

// Admin routes
router.use(requireAuth(["admin"]));

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceDto'
 *     responses:
 *       201:
 *         description: Service created
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  validateRequest(serviceValidation.createService),
  serviceController.createService
);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceDto'
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Service not found
 */
router.patch(
  "/:id",
  validateRequest(serviceValidation.updateService),
  serviceController.updateService
);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Services]
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
 *         description: Service deleted
 *       404:
 *         description: Service not found
 */
router.delete("/:id", serviceController.deleteService);

/**
 * @swagger
 * /api/services/types:
 *   get:
 *     summary: Get all service types
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of service types
 */
router.get("/types", serviceController.getServiceTypes);

/**
 * @swagger
 * /api/services/statuses:
 *   get:
 *     summary: Get all service statuses
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of service statuses
 */
router.get("/statuses", serviceController.getServiceStatuses);

// Image routes
router.post(
  "/:id/images",
  upload.single("image"),
  serviceController.uploadServiceImage
);

router.delete(
  "/:id/images/:imageIndex",
  serviceController.deleteServiceImage
);

export default router;
