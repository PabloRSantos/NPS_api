import "reflect-metadata";
import createConnection from "./database/index";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import { router } from "./routes";
import { AppError } from "./errors/appError";

createConnection();
const app = express();
app.use(express.json());

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError)
    return res.status(err.statusCode).json({ error: err.message });

  return res.status(500).json({
    status: "Error",
    message: `Internal server error ${err.message}`,
  });
});

export { app };
