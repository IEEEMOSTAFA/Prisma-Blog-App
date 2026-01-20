import { NextFunction ,Request,Response} from 'express'
import { error } from 'node:console'
import React from 'react'
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../lib/prisma';

export default function errorHandler (
    err: any, 
    req : Request, 
    res : Response, 
    next: NextFunction
) {
  let statusCode = 500;
  let errorMessage  = "Internal Server Error";
  let errorDetails = err;

  // Prisma Client Validation Error :
  if(err instanceof Prisma.PrismaClientValidationError){
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields !"
  }

  // PrismaClientKnownRequestError:
  else if(err instanceof Prisma.PrismaClientKnownRequestError){
    if(err.code === "P2025"){
        statusCode = 400;
        errorMessage = "An operation failed because it depends on one or more records that were required but not found. {cause}"
    }
    else if( err.code === "P2002"){
        statusCode = 4000;
        errorMessage = "Duplicate Key error..."
    }

    else if (err.code === "P2003"){
        statusCode = 400;
        errorMessage = "Foreign key constraint failed on the field"
    }
  }


  else if (err instanceof Prisma.PrismaClientUnknownRequestError){
    statusCode = 500;
    errorMessage = "Error occurred during query execution"
  }
  else if (err instanceof Prisma.PrismaClientInitializationError){
    if(err.errorCode === "p1000"){
        statusCode = 401;
        errorMessage = "Authentication failed. Please check your creditials!"
    }
    else if(err.errorCode === "P1001"){
        statusCode = 400;
        errorMessage = "Can't reach database server"
    }
   
  }


  res.status(statusCode)
  res.json({
    message: errorMessage,
    error:error
  })
}


