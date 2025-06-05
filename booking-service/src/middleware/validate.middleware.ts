import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppError } from './error.middleware';
import { logger } from '../utils/logger';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const dtoObject = plainToClass(dtoClass, req.body);
      const errors = await validate(dtoObject, { skipMissingProperties: true });

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error: ValidationError) => {
            if (error.constraints) {
              return Object.values(error.constraints);
            }
            return [];
          })
          .flat();

        logger.warn('Validation failed:', { errors: errorMessages });
        throw new AppError(400, `Validation failed: ${errorMessages.join(', ')}`);
      }

      req.body = dtoObject;
      next();
    } catch (error) {
      next(error);
    }
  };
};
