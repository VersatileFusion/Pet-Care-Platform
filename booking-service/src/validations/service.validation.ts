import { z } from "zod";

export const serviceValidation = {
  createService: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    duration: z.number().positive(),
    category: z.string().min(1),
    maxPetsPerSlot: z.number().positive(),
    isActive: z.boolean().optional(),
  }),

  updateService: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    duration: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    maxPetsPerSlot: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  }),
}; 