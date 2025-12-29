import { prisma } from "./lib/prisma";
import app from "./app"
const PORT = process.env.PORT || 3000

async function main() {
    try{
       await prisma.$connect();
       console.log("Connected to the database Successfully");

       app.listen(PORT,() =>{
        console.log(`Server is running on http://localhost:3000 `)
       })
    }
    catch(error){
         console.error("An error Occured",error);
         await prisma.$disconnect();
         process.exit(1);
    }
    
}

main();