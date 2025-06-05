import { Booking } from "../entities/booking.entity";
import { Service } from "../entities/service.entity";
import { logger } from "../utils/logger";

export class NotificationService {
  async sendBookingConfirmation(booking: Booking, _service: Service) {
    try {
      // TODO: Implement email/SMS notification
      logger.info("Booking confirmation sent", { bookingId: booking.id });
    } catch (error) {
      logger.error("Failed to send booking confirmation", error);
    }
  }

  async sendBookingCancellation(booking: Booking, _service: Service) {
    try {
      // TODO: Implement email/SMS notification
      logger.info("Booking cancellation sent", { bookingId: booking.id });
    } catch (error) {
      logger.error("Failed to send booking cancellation", error);
    }
  }

  async sendBookingReminder(booking: Booking, _service: Service) {
    try {
      // TODO: Implement email/SMS notification
      logger.info("Booking reminder sent", { bookingId: booking.id });
    } catch (error) {
      logger.error("Failed to send booking reminder", error);
    }
  }

  async sendBookingUpdate(booking: Booking, _service: Service) {
    try {
      // TODO: Implement email/SMS notification
      logger.info("Booking update sent", { bookingId: booking.id });
    } catch (error) {
      logger.error("Failed to send booking update", error);
    }
  }

  async sendAdminNotification(
    booking: Booking,
    _service: Service,
    type: string
  ) {
    try {
      // TODO: Implement admin notification
      logger.info("Admin notification sent", { bookingId: booking.id, type });
    } catch (error) {
      logger.error("Failed to send admin notification", error);
    }
  }
}
