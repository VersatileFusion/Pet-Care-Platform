import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Service } from "../entities/service.entity";
import { AppError } from "../middleware/error.middleware";
import { logger } from "../utils/logger";
import { uploadToS3, deleteFromS3 } from "../utils/s3";

export class ServiceController {
  private serviceRepository = AppDataSource.getRepository(Service);

  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = this.serviceRepository.create(req.body);
      await this.serviceRepository.save(service);
      res.status(201).json(service);
    } catch (error) {
      logger.error("Create service error:", error);
      next(new AppError(500, "Failed to create service"));
    }
  }

  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "DESC",
        type,
        status,
        minPrice,
        maxPrice,
      } = req.query;

      const queryBuilder = this.serviceRepository.createQueryBuilder("service");

      if (type) {
        queryBuilder.andWhere("service.type = :type", { type });
      }

      if (status) {
        queryBuilder.andWhere("service.status = :status", { status });
      }

      if (minPrice) {
        queryBuilder.andWhere("service.price >= :minPrice", { minPrice });
      }

      if (maxPrice) {
        queryBuilder.andWhere("service.price <= :maxPrice", { maxPrice });
      }

      const [services, total] = await queryBuilder
        .orderBy(`service.${sortBy}`, sortOrder as "ASC" | "DESC")
        .skip((Number(page) - 1) * Number(limit))
        .take(Number(limit))
        .getManyAndCount();

      res.json({
        data: services,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      logger.error("Get services error:", error);
      next(new AppError(500, "Failed to fetch services"));
    }
  }

  async getService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id: req.params.id },
      });

      if (!service) {
        throw new AppError(404, "Service not found");
      }

      res.json(service);
    } catch (error) {
      logger.error("Get service error:", error);
      next(new AppError(500, "Failed to fetch service"));
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id: req.params.id },
      });

      if (!service) {
        throw new AppError(404, "Service not found");
      }

      this.serviceRepository.merge(service, req.body);
      await this.serviceRepository.save(service);
      res.json(service);
    } catch (error) {
      logger.error("Update service error:", error);
      next(new AppError(500, "Failed to update service"));
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.serviceRepository.delete(req.params.id);
      if (result.affected === 0) {
        throw new AppError(404, "Service not found");
      }
      res.status(204).send();
    } catch (error) {
      logger.error("Delete service error:", error);
      next(new AppError(500, "Failed to delete service"));
    }
  }

  async getServiceTypes(_req: Request, res: Response, next: NextFunction) {
    try {
      const types = await this.serviceRepository
        .createQueryBuilder("service")
        .select("DISTINCT service.type")
        .getRawMany();
      res.json(types.map((t) => t.type));
    } catch (error) {
      logger.error("Get service types error:", error);
      next(new AppError(500, "Failed to fetch service types"));
    }
  }

  async getServiceStatuses(_req: Request, res: Response, next: NextFunction) {
    try {
      const statuses = await this.serviceRepository
        .createQueryBuilder("service")
        .select("DISTINCT service.status")
        .getRawMany();
      res.json(statuses.map((s) => s.status));
    } catch (error) {
      logger.error("Get service statuses error:", error);
      next(new AppError(500, "Failed to fetch service statuses"));
    }
  }

  async uploadServiceImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError(400, "No file uploaded");
      }

      const service = await this.serviceRepository.findOne({
        where: { id: req.params.id },
      });

      if (!service) {
        throw new AppError(404, "Service not found");
      }

      const imageUrl = await uploadToS3(req.file, "services");
      service.images = [...(service.images || []), { url: imageUrl, alt: req.file.originalname }];
      await this.serviceRepository.save(service);

      res.json({ imageUrl });
    } catch (error) {
      logger.error("Upload service image error:", error);
      next(new AppError(500, "Failed to upload image"));
    }
  }

  async deleteServiceImage(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id: req.params.id },
      });

      if (!service) {
        throw new AppError(404, "Service not found");
      }

      const imageIndex = parseInt(req.params.imageIndex);
      if (!service.images || imageIndex >= service.images.length) {
        throw new AppError(404, "Image not found");
      }

      const imageUrl = service.images[imageIndex].url;
      await deleteFromS3(imageUrl);

      service.images = service.images.filter((_, i) => i !== imageIndex);
      await this.serviceRepository.save(service);

      res.status(204).send();
    } catch (error) {
      logger.error("Delete service image error:", error);
      next(new AppError(500, "Failed to delete image"));
    }
  }
}
