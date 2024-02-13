import { AuthController } from "@/controllers";
import auth from "@/middlewares/auth";
import { Router } from "express";

const router = Router();

router.route("/register").post(AuthController.register);
router.route("/login").post(AuthController.login);
router.route("/logout").post(AuthController.logout);
router.route("/refresh-auth").post(AuthController.refreshAuth);
router.route("/forgot-password").post(AuthController.forgotPassword);
router.route("/reset-password").post(AuthController.resetPassword);
router
  .route("/send-verification-email")
  .get(auth(), AuthController.sendVerificationEmail);
router.route("/verify-email").post(AuthController.verifyEmail);

export default router;
