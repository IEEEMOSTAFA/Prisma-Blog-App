import express, { NextFunction, Router,Request,Response } from "express";
import { PostController } from "./post.controller";
// import { betterAuth } from "better-auth/*";
import { auth as betterAuth } from "../../lib/auth";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();





router.get(
    "/",
    PostController.getAlPost
)

router.get(
    "/stats",
    auth(UserRole.ADMIN),
    PostController.getStats
)


router.get(
    "/my-posts",
    auth(UserRole.USER , UserRole.ADMIN),
    PostController.getMyPosts
)

router.get(
    "/:postId",
    PostController.getPostById
)


router.post(
    "/",
    auth("ADMIN","USER"),
    PostController.createPost
)

router.patch(
    "/:postId",
    auth(UserRole.USER, UserRole.ADMIN),
    PostController.updatePosts
)
router.delete(
    "/:postId",
    auth(UserRole.USER, UserRole.ADMIN),
    PostController.deletePost
)



export const postRouter: Router = router;