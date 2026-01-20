import { date, email } from "better-auth/*";
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { PostWhereInput } from "../../../generated/prisma/models";
import { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";
import { error } from "node:console";




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



const getMyPosts = async (authorId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id:authorId,
      status: "ACTIVE"
    },
    select: {
      id: true
    }
  })


  const result = await prisma.post.findMany({
    where:{
      authorId
    },
    orderBy: {
      created: "desc"  // alert this line
    },
    include: {
      _count: {
        select:{
          comments: true
        }
      }
    }

  });


  return result;
}

// User - Only update own post 
// admin - can update user and admin

const updatePost = async(postId: string,data: Partial<Post>,authorId: string,isAdmin: boolean) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    },
    select: {
      id: true,
      authorId: true
    }
  })


  if(!isAdmin && (postData.authorId !== authorId)) {
    throw new Error("You are not owner or creator of the post !")
  }

  if(!isAdmin){
    delete data.isFeatured
  }

  const result = await prisma.post.update({
    where: {
      id: postData.id
    },
    data
  })

  return result;
}

const deletePost = async(postId: string,authorId: string,isAdmin: boolean) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id:postId
    },
    select: {
      id: true,
      authorId: true
    }
  })


  if(!isAdmin && (postData.authorId !== authorId)){
    throw new Error("You are not owner of the post!!")
  }

  return await prisma.post.delete({
    where: {
      id: postId
    }
  })


}


// Statics Check:


const getStats = async () => {
  return await prisma.$transaction(async (tx) =>{
    const [totalPosts, publishedPosts, draftPosts, archivedPosts, totalComments, approvedComment, totalUsers,adminCount,userCount,totalViews] = await Promise.all([
     await tx.post.count(),
     await tx.post.count({where: {status: PostStatus.PUBLISHED}}),
     await tx.post.count({where: {status: PostStatus.DRAFT}}),
      await tx.post.count({where: {status: PostStatus.ARCHIVED}}),
     await tx.comment.count(),
    //  await tx.post.count({where: {status:CommentStatus.APPROVED}}),
     await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
     await tx.user.count(),
     await tx.user.count({where: {role: "ADMIN"}}),
     await tx.user.count({where: {role: "USER"}}),
    

     await tx.post.aggregate({
      _sum: {views: true}
     })


    ])

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComment,
      totalUsers,
      adminCount,
      userCount,
      totalViews: totalViews._sum.views || 0 
      
    }
  })
}




export const postService = {
  createPost,
  getAlPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats
}




































