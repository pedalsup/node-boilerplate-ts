import { Router } from "express";
import { UserController } from "../../controllers";

const router = Router();

router.route("/").get(UserController.get);
router.route("/:id").get(UserController.get);
router.route("/").post(UserController.post);
router.route("/:id").put(UserController.put);
router.route("/:id").delete(UserController.remove);

export default router;
