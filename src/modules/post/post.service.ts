import { email } from "better-auth/*";
import { Post } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createPost = async (data: Omit<Post, 'id' | 'created' | 'updateAt' | 'authorId'>, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId
    }
  })
  return result;
}

const getAlPost = async (payload: { 
  search?: string,
  tags?: string[]
}) => {
  const allPosts = await prisma.post.findMany({
    where: {
      AND: [

        payload.search && {
          OR: [
            {
              title: {
                contains: payload.search as string,
                mode: "insensitive"
              }
            },
            {
              content: {
                contains: payload.search as string,
                mode: "insensitive"
              }
            },
            {
              tags: {
                has: payload.search as string
              }
            }
          ]
        },
        {
          tags: {
            hasEvery: payload.tags as string[]
          }
        }
      ]
    }
  });
  return allPosts;
}

export const postService = {
  createPost,
  getAlPost
}




































// import { email } from "better-auth/*";
// import { Post } from "../../../generated/prisma/client"
// import { prisma } from "../../lib/prisma"

// const createPost = async (data: Omit<Post, 'id' | 'created' | 'updateAt' | 'authorId'>, userId: string) => {
//   const result = await prisma.post.create({
//     data: {
//       ...data,
//       authorId: userId
//     }
//   })
//   return result;
// }

// const getAlPost = async (payload: { search: string | undefined,
//   tags: string [] | []
  

//  }) => {
//   const allPosts = await prisma.post.findMany({
//     where: {
//      AND: [
//       {
//         OR: [
//         {
//           title: {
//             contains: payload.search as string,
//             mode: "insensitive"
//           },

//         },
//         {
//           content: {
//             contains: payload.search as string,
//             mode: "insensitive"
//           }
//         },
//         {
//           tags: {
//           has : payload.search as string,
            

//           }
//         }
//       ],
//       tags: {
//         hasEvery: payload.tags as string[]
//       }  
//       },
//       {}
//      ]
//     }
//   });
//   return allPosts;
// }

// export const postService = {
//   createPost,
//   getAlPost
// }