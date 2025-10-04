import express from "express";
import * as authController from "../controllers/authController";
import validate from "../middleware/validate";
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logOut);
router.get("/profile", authMiddleware, authController.me);

export default router;