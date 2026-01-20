import { error } from "node:console";
import { CommentStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

// Create Comment: 
let createComment = async (payload: {

    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
}) => {
    console.log("Create Comment Service...!");
    await prisma.post.findFirstOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        await prisma.post.findUniqueOrThrow({
            where: {
                id: payload.postId
            }
        })

    }

    return await prisma.comment.create({
        data: payload
    })


    console.log("Create Comment: ",payload);
};


// Get Element By Id:

const getCommentById = async(id: string) => {
    return await prisma.comment.findUnique({
        where:{
            id
        },
        include: {
            post: {
                select:{
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })
}

// Get comment By Author: 
const getCommentsByAuthor = async(authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}


// Delete Comment:

const deleteComment = async(commentId: string,authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })
    if(!commentData){
        throw new Error("Your Provided Input is Invalid:")
    }


    return await prisma.comment.delete({
        where : {
            id: commentData.id
        }
    })
}



const updateComment = async (commentId: string, data: {content?: string,status ?: CommentStatus}, authorId: string)  =>{
 const commentData = await prisma.comment.findFirst({
    where: {
        id: commentId,
        authorId
    },
    select: {
        id: true
    }
 })
 
 if(!commentData){
    throw new Error("Your provided input is invalid! ")
 }

 return await prisma.comment.update({
    where: {
        id: commentId,
        authorId
    },
    data
 })
}


const moderateComment = async (id: string,data: {status: CommentStatus} ) =>{
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    });

    if (commentData.status === data.status){
        throw new Error(`Your Provider status (${data.status}) is already up to date.`)
    }

    return await prisma.comment.update({
        where: {
            id
        },
        data
    })
}

export const CommentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}