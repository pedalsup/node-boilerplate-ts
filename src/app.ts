import express from "express";
import cors from "cors";

const app = express();
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// api routes
// app.use("/user", userRoutes);
// app.use("/admin", adminRoutes);
// app.use("/", commonRoutes);

// send back a 404 error for any unknown api request
app.use("*", (req, res, next) => {
  let message = {
    status: 404,
    message: "Requested API not found",
    data: {},
  };
  return res.status(404).send(message);
});

export default app;
