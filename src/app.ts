import express from "express";
import cors from "cors";
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
  requestLogger,
} from "./middlewares/errorhandler";
import publicRoutes from "./routes/public";

const app = express();
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

app.use(requestLogger);

// api routes
app.use("/user", publicRoutes);
// app.use("/admin", adminRoutes);
// app.use("/", commonRoutes);

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

export default app;
