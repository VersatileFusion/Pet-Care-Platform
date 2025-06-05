import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import {
  Booking,
  BookingStatus,
} from "../entities/booking.entity";
import { Service } from "../entities/service.entity";
import { AppError } from "../middleware/error.middleware";
import { logger } from "../utils/logger";
import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { NotificationService } from "../services/notification.service";
import {
  getPaginationOptions,
  getPaginationMeta,
  createOrderByClause,
  createWhereClause,
  PaginatedResponse,
} from "../utils/pagination";

export class BookingController {
  private bookingRepository = AppDataSource.getRepository(Booking);
  private serviceRepository = AppDataSource.getRepository(Service);
  private notificationService = new NotificationService();

  createBooking = async (req: Request, res: Response) => {
    try {
      const { serviceId, petId, startTime, specialInstructions } = req.body;
      const userId = (req.user as any).id;

      // Check if service exists and is active
      const service = await this.serviceRepository.findOneBy({ id: serviceId });
      if (!service) {
        throw new AppError(404, "Service not found");
      }

      if (service.status !== "active") {
        throw new AppError(400, "Service is not available");
      }

      // Calculate end time based on service duration
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + service.duration);

      // Check for booking conflicts and capacity
      const conflictingBookings = await this.bookingRepository.find({
        where: {
          serviceId,
          startTime: LessThanOrEqual(endTime),
          endTime: MoreThanOrEqual(startTime),
          status: BookingStatus.CONFIRMED,
        },
      });

      // Check max bookings per slot
      if (conflictingBookings.length >= service.maxBookingsPerSlot) {
        throw new AppError(400, "Time slot is fully booked");
      }

      // Check max pets per booking
      const totalPetsInSlot = conflictingBookings.reduce((total, booking) => {
        return total + (booking.specialInstructions?.pets?.length || 1);
      }, 0);

      if (totalPetsInSlot + 1 > service.maxPetsPerBooking) {
        throw new AppError(400, "Maximum pets per slot reached");
      }

      // Calculate total price
      const totalPrice = service.discountPrice || service.basePrice;

      // Create booking
      const booking = this.bookingRepository.create({
        userId,
        serviceId,
        petId,
        startTime,
        endTime,
        totalPrice,
        specialInstructions,
        metadata: {
          source: req.headers["user-agent"] || "unknown",
          device: req.headers["user-agent"] || "unknown",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] || "unknown",
        },
      });

      await this.bookingRepository.save(booking);

      // Send notifications
      await this.notificationService.sendBookingConfirmation(booking, service);
      await this.notificationService.sendAdminNotification(
        booking,
        service,
        "new_booking"
      );

      res.status(201).json({ booking });
    } catch (error) {
      logger.error("Create booking error:", error);
      throw new AppError(500, "Failed to create booking");
    }
  };

  getBookings = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { status, paymentStatus, startDate, endDate } = req.query;
      const { page, limit, sortBy, sortOrder } = getPaginationOptions(
        req.query
      );

      // Build where clause
      const where: any = createWhereClause({
        userId,
        status,
        paymentStatus,
      });

      if (startDate && endDate) {
        where.startTime = Between(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      }

      // Get total count
      const total = await this.bookingRepository.count({ where });

      // Get paginated results
      const bookings = await this.bookingRepository.find({
        where,
        relations: ["service"],
        order: createOrderByClause(sortBy, sortOrder),
        skip: (page - 1) * limit,
        take: limit,
      });

      const response: PaginatedResponse<Booking> = {
        data: bookings,
        meta: getPaginationMeta(total, page, limit),
      };

      res.json(response);
    } catch (error) {
      logger.error("Get bookings error:", error);
      throw new AppError(500, "Failed to fetch bookings");
    }
  };

  getBooking = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;

      const booking = await this.bookingRepository.findOne({
        where: { id, userId },
        relations: ["service"],
      });

      if (!booking) {
        throw new AppError(404, "Booking not found");
      }

      res.json({ booking });
    } catch (error) {
      logger.error("Get booking error:", error);
      throw new AppError(500, "Failed to fetch booking");
    }
  };

  updateBooking = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;
      const updateData = req.body;

      const booking = await this.bookingRepository.findOne({
        where: { id, userId },
        relations: ["service"],
      });

      if (!booking) {
        throw new AppError(404, "Booking not found");
      }

      if (booking.status === BookingStatus.COMPLETED) {
        throw new AppError(400, "Cannot update completed booking");
      }

      // Update booking
      Object.assign(booking, updateData);
      await this.bookingRepository.save(booking);

      // Send notifications
      await this.notificationService.sendBookingUpdate(
        booking,
        booking.service
      );
      await this.notificationService.sendAdminNotification(
        booking,
        booking.service,
        "booking_update"
      );

      res.json({ booking });
    } catch (error) {
      logger.error("Update booking error:", error);
      throw new AppError(500, "Failed to update booking");
    }
  };

  cancelBooking = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;
      const { reason, notes } = req.body;

      const booking = await this.bookingRepository.findOne({
        where: { id, userId },
        relations: ["service"],
      });

      if (!booking) {
        throw new AppError(404, "Booking not found");
      }

      if (booking.status === BookingStatus.CANCELLED) {
        throw new AppError(400, "Booking is already cancelled");
      }

      if (booking.status === BookingStatus.COMPLETED) {
        throw new AppError(400, "Cannot cancel completed booking");
      }

      // Update booking status
      booking.status = BookingStatus.CANCELLED;
      booking.cancellationReason = {
        reason,
        notes,
        cancelledBy: userId,
        cancelledAt: new Date(),
      };

      await this.bookingRepository.save(booking);

      // Send notifications
      await this.notificationService.sendBookingCancellation(
        booking,
        booking.service
      );
      await this.notificationService.sendAdminNotification(
        booking,
        booking.service,
        "booking_cancellation"
      );

      res.json({ booking });
    } catch (error) {
      logger.error("Cancel booking error:", error);
      throw new AppError(500, "Failed to cancel booking");
    }
  };

  reviewBooking = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;
      const { rating, comment } = req.body;

      const booking = await this.bookingRepository.findOne({
        where: { id, userId },
      });

      if (!booking) {
        throw new AppError(404, "Booking not found");
      }

      if (booking.status !== BookingStatus.COMPLETED) {
        throw new AppError(400, "Can only review completed bookings");
      }

      if (booking.review) {
        throw new AppError(400, "Booking already reviewed");
      }

      // Add review
      booking.review = {
        rating,
        comment,
        createdAt: new Date(),
      };

      await this.bookingRepository.save(booking);

      res.json({ booking });
    } catch (error) {
      logger.error("Review booking error:", error);
      throw new AppError(500, "Failed to review booking");
    }
  };

  getAvailableSlots = async (req: Request, res: Response) => {
    try {
      const { serviceId, date } = req.query;
      const service = await this.serviceRepository.findOneBy({
        id: serviceId as string,
      });

      if (!service) {
        throw new AppError(404, "Service not found");
      }

      // Get all bookings for the service on the specified date
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = await this.bookingRepository.find({
        where: {
          serviceId: serviceId as string,
          startTime: Between(startOfDay, endOfDay),
          status: BookingStatus.CONFIRMED,
        },
      });

      // Get service schedule for the day
      const dayOfWeek = startOfDay
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const schedule =
        service.schedule[dayOfWeek as keyof typeof service.schedule];

      // Calculate available slots
      const availableSlots = [];
      for (const timeSlot of schedule) {
        const slotStart = new Date(`${date}T${timeSlot.start}`);
        const slotEnd = new Date(`${date}T${timeSlot.end}`);

        // Count bookings in this slot
        const slotBookings = bookings.filter((booking) => {
          return (
            (slotStart <= booking.startTime && booking.startTime < slotEnd) ||
            (slotStart < booking.endTime && booking.endTime <= slotEnd)
          );
        });

        // Check if slot is available based on max bookings and pets
        const totalPetsInSlot = slotBookings.reduce((total, booking) => {
          return total + (booking.specialInstructions?.pets?.length || 1);
        }, 0);

        const isAvailable =
          slotBookings.length < service.maxBookingsPerSlot &&
          totalPetsInSlot < service.maxPetsPerBooking;

        if (isAvailable) {
          availableSlots.push({
            start: timeSlot.start,
            end: timeSlot.end,
            remainingBookings: service.maxBookingsPerSlot - slotBookings.length,
            remainingPets: service.maxPetsPerBooking - totalPetsInSlot,
          });
        }
      }

      res.json({ availableSlots });
    } catch (error) {
      logger.error("Get available slots error:", error);
      throw new AppError(500, "Failed to fetch available slots");
    }
  };
}
