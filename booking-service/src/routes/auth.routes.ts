import { Router } from "express";
import { validateDto } from "../middleware/validate.middleware";
import { LoginDto, RegisterDto } from "../dto/auth.dto";

const router = Router();

// Login route
router.post("/login", validateDto(LoginDto), async (_req, res, next) => {
  try {
    // TODO: Implement login logic
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
});

// Register route
router.post(
  "/register",
  validateDto(RegisterDto),
  async (_req, res, next) => {
    try {
      // TODO: Implement registration logic
      res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
