import { Request,Response } from "express";
import { PostScalarFieldEnum } from "../../../generated/prisma/internal/prismaNamespace";
import { postService } from "./post.service";
import { error } from "node:console";

const createPost = async (req: Request,res: Response) => {
   try{
    const result = await postService.createPost(req.body,user.id as string)
    res.status(201).json(result)
   }
   catch(e){
    res.status(400).json({
        error:"Post Creation Failed",
        details: e
    })
   }

}

export const PostController ={
    createPost
}