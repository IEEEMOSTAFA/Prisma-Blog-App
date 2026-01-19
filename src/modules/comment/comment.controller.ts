import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request,res: Response) => {
   try{

    const user = req.user;
    req.body.authorId = user?.id;
    
    const result = await CommentService.createComment(req.body)

    res.status(201).json(result)
   }
   catch(e){
    res.status(400).json({
        error:"Post Creation Failed",
        details: e
    })
   }

}


const getCommentsByAuthor = async(req: Request, res: Response) => {
    try{
           const {authorId} = req.params

           const result =  await CommentService.getCommentsByAuthor(authorId as string)
           res.status(200).json(result)
    }
    catch (e) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: e
        })
    }
}


const getCommentById = async(req: Request, res: Response) => {
    try{
           const {commentId} = req.params

           const result =  await CommentService.getCommentById(commentId as string)
           res.status(200).json(result)
    }
    catch (e) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: e
        })
    }
}



const deleteComment = async(req: Request, res: Response) => {
    try{
           const user = req.user
           const {commentId} = req.params;

           const result =  await CommentService.deleteComment(commentId as string, user?.id as string)
           res.status(200).json(result)
    }
    catch (e) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: e
        })
    }
}







export const CommentController = {
    createComment,getCommentById,getCommentsByAuthor,deleteComment
}