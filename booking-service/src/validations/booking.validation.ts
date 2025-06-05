import { z } from "zod";

export const bookingValidation = {
  createBooking: z.object({
    serviceId: z.string().uuid(),
    date: z.string().datetime(),
    timeSlot: z.string(),
    petIds: z.array(z.string().uuid()),
    notes: z.string().optional(),
  }),

  updateBooking: z.object({
    date: z.string().datetime().optional(),
    timeSlot: z.string().optional(),
    petIds: z.array(z.string().uuid()).optional(),
    notes: z.string().optional(),
  }),

  createReview: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),

  updateBookingStatus: z.object({
    status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  }),
}; 