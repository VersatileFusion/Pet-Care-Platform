import { Appointment, AppointmentStatus } from "../models/appointment.model";
import { AppError } from "../middleware/error.middleware";

export class AppointmentService {
  public async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    try {
      const appointment = await Appointment.create(data);
      return appointment;
    } catch (error) {
      throw new AppError(400, "Failed to create appointment");
    }
  }

  public async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const appointment = await Appointment.findByPk(id);
      return appointment;
    } catch (error) {
      throw new AppError(400, "Failed to fetch appointment");
    }
  }

  public async updateAppointment(
    id: string,
    data: Partial<Appointment>
  ): Promise<Appointment | null> {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return null;
      }
      await appointment.update(data);
      return appointment;
    } catch (error) {
      throw new AppError(400, "Failed to update appointment");
    }
  }

  public async deleteAppointment(id: string): Promise<void> {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new AppError(404, "Appointment not found");
      }
      await appointment.destroy();
    } catch (error) {
      throw new AppError(400, "Failed to delete appointment");
    }
  }

  public async getAppointmentsByPetId(petId: string): Promise<Appointment[]> {
    try {
      const appointments = await Appointment.findAll({
        where: { petId },
        order: [["createdAt", "DESC"]],
      });
      return appointments;
    } catch (error) {
      throw new AppError(400, "Failed to fetch appointments");
    }
  }

  public async getAppointmentsByVetId(vetId: string): Promise<Appointment[]> {
    try {
      const appointments = await Appointment.findAll({
        where: { vetId },
        order: [["createdAt", "DESC"]],
      });
      return appointments;
    } catch (error) {
      throw new AppError(400, "Failed to fetch appointments");
    }
  }

  public async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus
  ): Promise<Appointment | null> {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return null;
      }
      await appointment.update({ status });
      return appointment;
    } catch (error) {
      throw new AppError(400, "Failed to update appointment status");
    }
  }
} 