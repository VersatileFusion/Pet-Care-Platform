import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Pet } from "../entities/pet.entity";
import { User } from "../entities/user.entity"; // Assuming we might need to check user existence
import { AppError } from "../middleware/error.middleware";
import { CreatePetDto, UpdatePetDto } from "../dto/pet.dto";

// Helper to get Pet repository
const getPetRepository = () => getRepository(Pet);
const getUserRepository = () => getRepository(User);

export const getAllPets = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement user-specific pet fetching based on req.user.id
    const pets = await getPetRepository().find();
    res.json(pets);
  } catch (err) {
    next(err);
  }
};

export const getPetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pet = await getPetRepository().findOne({
      where: { id: req.params.id },
    });
    if (!pet) {
      throw new AppError(404, "Pet not found");
    }
    // TODO: Add authorization check (does req.user own this pet?)
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

export const createPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Assuming validateDto middleware has already validated req.body against CreatePetDto
    const petData: CreatePetDto = req.body;

    // TODO: Get userId from authenticated user (req.user.id) instead of body
    const userId = petData.userId; // Use from body for now, will change later

    // Optional: Check if the user exists
    const user = await getUserRepository().findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const pet = getPetRepository().create(petData);
    // Ensure the userId from auth is used
    // pet.userId = req.user.id; // Uncomment when integrating with auth middleware fully

    await getPetRepository().save(pet);
    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
};

export const updatePet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const petId = req.params.id;
    const petData: UpdatePetDto = req.body;

    const pet = await getPetRepository().findOne({ where: { id: petId } });
    if (!pet) {
      throw new AppError(404, "Pet not found");
    }

    // TODO: Add authorization check (does req.user own this pet?)

    getPetRepository().merge(pet, petData);
    await getPetRepository().save(pet);
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

export const deletePet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const petId = req.params.id;
    const pet = await getPetRepository().findOne({ where: { id: petId } });
    if (!pet) {
      throw new AppError(404, "Pet not found");
    }

    // TODO: Add authorization check (does req.user own this pet?)

    await getPetRepository().remove(pet);
    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    next(err);
  }
};
