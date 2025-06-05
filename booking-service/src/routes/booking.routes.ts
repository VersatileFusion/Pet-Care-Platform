import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { verifyToken, requireAuth } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { bookingValidation } from "../validations/booking.validation";
import { apiLimiter } from "../middleware/rate-limit.middleware";

const router = Router();
const bookingController = new BookingController();

// Apply rate limiter to all booking routes
router.use(apiLimiter);

// Public routes
router.get("/available-slots", bookingController.getAvailableSlots);

// Protected routes
router.use(verifyToken);

// Create a new booking
router.post(
  "/",
  validateRequest(bookingValidation.createBooking),
  bookingController.createBooking
);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed, no_show]
 *         description: Filter by booking status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, paid, refunded, failed]
 *         description: Filter by payment status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: Paginated list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
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
router.get("/", bookingController.getBookings);

// Get a specific booking
router.get("/:id", bookingController.getBooking);

// Update a booking
router.patch(
  "/:id",
  validateRequest(bookingValidation.updateBooking),
  bookingController.updateBooking
);

// Cancel a booking
router.delete("/:id", bookingController.cancelBooking);

// Review a booking
router.post(
  "/:id/review",
  validateRequest(bookingValidation.createReview),
  bookingController.reviewBooking
);

// Admin routes
router.use(requireAuth(["admin"]));
router.patch(
  "/admin/:id/status",
  validateRequest(bookingValidation.updateBookingStatus),
  bookingController.updateBooking
);

export default router;
