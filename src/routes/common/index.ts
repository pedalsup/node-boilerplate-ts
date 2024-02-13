import { Router } from "express";
import authRoutes from "./auth.router";

const router = Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
