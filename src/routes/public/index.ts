import { Router } from "express";
import userRoutes from "./user.router";

const router = Router();

const defaultRoutes = [
  {
    path: "/account",
    route: userRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
