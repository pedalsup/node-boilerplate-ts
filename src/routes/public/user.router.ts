import { Router } from "express";
import { UserController } from "@/controllers";
import auth from "@/middlewares/auth";

const router = Router();

router.route("/").get(auth("getUsers"), UserController.getAll);
router.route("/:id").get(UserController.get);
router.route("/:id").put(UserController.put);
router.route("/:id").delete(UserController.remove);

export default router;
