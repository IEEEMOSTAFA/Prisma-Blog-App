import { date } from "better-auth/*";
import { Request, Response } from "express";
import path from "node:path";


export default function notFound(req: Request,res: Response) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  })
}
