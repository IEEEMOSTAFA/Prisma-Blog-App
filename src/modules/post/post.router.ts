import express, { NextFunction, Router,Request,Response } from "express";
import { PostController } from "./post.controller";
// import { betterAuth } from "better-auth/*";
import { auth as betterAuth } from "../../lib/auth";
import auth from "../../middlewares/auth";

const router = express.Router();


router.post(
    "/",
    auth("ADMIN","USER"),
    PostController.createPost
)

export const postRouter: Router = router;