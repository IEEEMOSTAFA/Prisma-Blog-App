import { date, email } from "better-auth/*";
import { Post, PostStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { PostWhereInput } from "../../../generated/prisma/models";
import { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";




const createPost = async (data: Omit<Post, 'id' | 'created' | 'updateAt' | 'authorId'>, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId
    }
  })
  return result;
}


const getAlPost = async ( {
  search,
  tags = [],
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder


}: { 
  search?: string | undefined,
  tags?: string[] | [],
  isFeatured : boolean | undefined,
  status: PostStatus | undefined,
  authorId: string| undefined,
  page: number,
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: SortOrder
}) => {

  const andCondition : PostWhereInput[] = [];

  if(search) {
    andCondition.push({
      OR: [
            {
              title: {
                contains: search ,
                mode: "insensitive"
              }
            },
            {
              content: {
                contains: search ,
                mode: "insensitive"
              }
            },
            {
              tags: {
                has: search
              }
            }
          ]
    })
  }

  if(tags.length  > 0 ){
    andCondition.push({
      tags: {
        hasEvery: tags as string[]
      }
    })
  }
  if(typeof isFeatured === 'boolean'){
    andCondition.push({
      isFeatured
    })
  }
  if(status){
    andCondition.push({
      status
    })
  }
  if(authorId){
    andCondition.push({
      authorId
    })
  }
  

  const allPost = await prisma.post.findMany({
    take: limit,
    skip,
    
    where: {
       AND: andCondition
    },
    orderBy: {
      [sortBy]:  sortOrder
    }
  });

  const total = await prisma.post.count({
    where: {
      AND: andCondition
    }
  })
  return {
    
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)

    }
  } ;
}


const getPostById = async(postId: string) =>{

  return await prisma.$transaction( async(tx) =>{
    await tx.post.update({
      where: {
        id: postId
      },
      data: {
        views: {
          increment: 1
        }
      }
    })



    const postData = await tx.post.findUnique({
      where: {
        id : postId
      }
    })
    return postData
  })

}







export const postService = {
  createPost,
  getAlPost,
  getPostById
}




































