import { prisma } from "../lib/prisma"
import { UserRole } from "../middlewares/auth"


async function seedAdmin() {
    try{
         console.log(".......Admin Sending Started....")
        const adminData = {
             name: "Muna",
            email: "muna@gmail.com",
            role: UserRole.ADMIN,
            password: "muna1234"
        }
         console.log(".....Checking admin exist or not.....")
        // Check User exist on db or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });
        if(existingUser){
            throw new Error("User already exists!!! ");
        }



        const signUpAdmin  = await fetch("http://localhost:3000/api/auth/sign-up/email",{
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        })



        if(signUpAdmin.ok){
            console.log("*** Admin Created")
      
        await prisma.user.update({
            where: {
                email: adminData.email
            },
            data: {
                emailVerified: true
            }
        })
        console.log("********Email verification status updated!**********")
    }
         console.log("********SUCCESS**********")
      }
    catch(error)
    {
        console.log(error);
    }
}

seedAdmin()