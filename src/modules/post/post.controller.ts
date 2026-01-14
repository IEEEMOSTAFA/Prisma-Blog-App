import { Request,Response } from "express";
import { PostScalarFieldEnum } from "../../../generated/prisma/internal/prismaNamespace";
import { postService } from "./post.service";
import { error } from "node:console";

const createPost = async (req: Request,res: Response) => {
   try{

    const user = req.user;
    if(!user){
        return res.status(400).json({
            error: "Unauthorized"
        })
    }
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

const getAlPost = async (req: Request, res: Response) =>{
    try{
        const {search} = req.query
        console.log("Search Value : ",search);
        const searchString = typeof search === 'string' ? search : undefined
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

        const result = await postService.getAlPost({search : searchString ,tags});
        res.status(200).json(result)
    }
    catch(e){
         res.status(400).json({
        error:"Failed to get posts",
        details: e
    })
    }
}

export const PostController ={
    createPost,getAlPost
}