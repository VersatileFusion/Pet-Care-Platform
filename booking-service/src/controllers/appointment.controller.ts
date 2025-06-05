import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { AppError } from '../middleware/error.middleware';
import { AppointmentService } from "../services/appointment.service";

export const getAllAppointments = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(Appointment);
    const appointments = await repo.find();
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(Appointment);
    const appointment = await repo.findOne({ where: { id: req.params.id } });
    if (!appointment) {
      throw new AppError(404, 'Appointment not found');
    }
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

// Placeholder for payment intent validation (should call payment microservice in production)
async function validatePaymentIntent(paymentIntentId: string): Promise<boolean> {
  // TODO: Replace with real HTTP call to payment microservice
  // For now, just check if the string is non-empty
  return !!paymentIntentId && paymentIntentId.length > 5;
}

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(Appointment);
    const { petId, serviceId, startTime, endTime, totalAmount, paymentIntentId } = req.body;

    // Check for overlapping appointments for the same pet and service
    const overlap = await repo.createQueryBuilder('appointment')
      .where('appointment.petId = :petId', { petId })
      .andWhere('appointment.serviceId = :serviceId', { serviceId })
      .andWhere('appointment.status != :cancelled', { cancelled: AppointmentStatus.CANCELLED })
      .andWhere('((appointment.startTime, appointment.endTime) OVERLAPS (:startTime, :endTime))', { startTime, endTime })
      .getOne();

    if (overlap) {
      throw new AppError(409, 'This pet already has an overlapping appointment for this service.');
    }

    // If payment is required, validate paymentIntentId
    if (totalAmount > 0) {
      if (!paymentIntentId) {
        throw new AppError(400, 'Payment intent is required for paid appointments.');
      }
      const isValid = await validatePaymentIntent(paymentIntentId);
      if (!isValid) {
        throw new AppError(400, 'Invalid or incomplete payment intent.');
      }
    }

    const appointment = repo.create(req.body);
    await repo.save(appointment);
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(Appointment);
    const appointment = await repo.findOne({ where: { id: req.params.id } });
    if (!appointment) {
      throw new AppError(404, 'Appointment not found');
    }

    // If startTime or endTime is being updated, check for overlaps
    const { petId, serviceId } = appointment;
    const newStartTime = req.body.startTime || appointment.startTime;
    const newEndTime = req.body.endTime || appointment.endTime;
    if (req.body.startTime || req.body.endTime) {
      const overlap = await repo.createQueryBuilder('a')
        .where('a.petId = :petId', { petId })
        .andWhere('a.serviceId = :serviceId', { serviceId })
        .andWhere('a.status != :cancelled', { cancelled: AppointmentStatus.CANCELLED })
        .andWhere('a.id != :id', { id: appointment.id })
        .andWhere('((a.startTime, a.endTime) OVERLAPS (:startTime, :endTime))', { startTime: newStartTime, endTime: newEndTime })
        .getOne();
      if (overlap) {
        throw new AppError(409, 'This pet already has an overlapping appointment for this service.');
      }
    }

    repo.merge(appointment, req.body);
    await repo.save(appointment);
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

export const cancelAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(Appointment);
    const appointment = await repo.findOne({ where: { id: req.params.id } });
    if (!appointment) {
      throw new AppError(404, 'Appointment not found');
    }
    appointment.status = AppointmentStatus.CANCELLED;
    await repo.save(appointment);
    res.json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    next(err);
  }
};

export class AppointmentController {
  private appointmentService: AppointmentService;

  constructor() {
    this.appointmentService = new AppointmentService();
  }

  public createAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointment = await this.appointmentService.createAppointment(
        req.body
      );
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  };

  public getAppointmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointment = await this.appointmentService.getAppointmentById(
        req.params.id
      );
      if (!appointment) {
        throw new AppError(404, "Appointment not found");
      }
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  };

  public updateAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointment = await this.appointmentService.updateAppointment(
        req.params.id,
        req.body
      );
      if (!appointment) {
        throw new AppError(404, "Appointment not found");
      }
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  };

  public deleteAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.appointmentService.deleteAppointment(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  public getAppointmentsByPetId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointments = await this.appointmentService.getAppointmentsByPetId(
        req.params.petId
      );
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  };

  public getAppointmentsByVetId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointments = await this.appointmentService.getAppointmentsByVetId(
        req.params.vetId
      );
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  };

  public updateAppointmentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { status } = req.body;
      if (!Object.values(AppointmentStatus).includes(status)) {
        throw new AppError(400, "Invalid appointment status");
      }
      const appointment = await this.appointmentService.updateAppointmentStatus(
        req.params.id,
        status
      );
      if (!appointment) {
        throw new AppError(404, "Appointment not found");
      }
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  };
} 