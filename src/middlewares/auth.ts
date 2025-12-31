
import express, { NextFunction, Router,Request,Response } from "express";

// import { betterAuth } from "better-auth/*";
import { auth as betterAuth } from "../lib/auth";
import { email, success } from "better-auth/*";





export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request{
            user?: {
                id: string;
                email: string;
                 name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

const auth=(...roles: any) =>{
   return async(req:Request, res: Response,next:NextFunction)=>{
      // get user  Session:
     try{

         const session = await betterAuth.api.getSession({
        headers: req.headers as any
      })

      if(!session){
        return res.status(401).json({
            success: false,
            message: "You are not authorized....!"
        })
      }
      if(!session.user.emailVerified){
        return res.status(403).json({
            success: false,
            message:"Email Verification required.Please Verify You Email.."
        })
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified
      }
      if(roles.length && !roles.includes(req.user.role as UserRole)){
        return res.status(403).json({
            success: false,
            message : "Forbidden ! You don't have permission to access this resources !! "
        })
      }
      next()
     }
     catch(err){
        next(err);
        
     }

     





      
    }
    
   
};

export default auth;