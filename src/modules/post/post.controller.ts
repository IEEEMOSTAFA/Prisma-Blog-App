import { Request,Response } from "express";
import { PostScalarFieldEnum } from "../../../generated/prisma/internal/prismaNamespace";
import { postService } from "./post.service";
import { error } from "node:console";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { string } from "better-auth/*";

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
        const isFeatured = req.query.isFeatured
         ? req.query.isFeatured === 'true' ? true
          : req.query.isFeatured === 'false' ? false
         : undefined

         : undefined
        // console.log(isFeatured);
        const status = req.query.status as PostStatus | undefined
        const authorId = req.query.authorId as string | undefined

        const {page,limit,skip,sortBy,sortOrder} = paginationSortingHelper(req.query)
        


        const result = await postService.getAlPost({search : searchString ,tags,isFeatured,status,authorId,page,limit,skip,sortBy,sortOrder});
        res.status(200).json(result)
    }
    catch(e){
         res.status(400).json({
        error:"Failed to get posts",
        details: e
    })
    }
}

const getPostById = async ( req: Request, res : Response) => {
    try{
     const {postId} = req.params;
     if(!postId){
        throw new Error("Post Id is required!!")
     }
     const result = await postService.getPostById(postId);
     res.status(200).json(result)
    }
    catch(e){
         res.status(400).json({
        error:"Post creation Failed",
        details: e
    })
    }
}

export const PostController ={
    createPost,
    getAlPost,
    getPostById
}