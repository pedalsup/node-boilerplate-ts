import express from "express";
import cors from "cors";
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
  requestLogger,
} from "./middlewares/errorhandler";
import publicRoutes from "./routes/public";
import commonRoutes from "./routes/common";
import passport from "passport";
import { jwtStrategy } from "./config/passport";

const app = express();
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use(requestLogger);

// api routes
app.use("/user", publicRoutes);
// app.use("/admin", adminRoutes);
app.use("/", commonRoutes);

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

export default app;

// define type for body
// validation
// JWT Authetication
