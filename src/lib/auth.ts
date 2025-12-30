// import { betterAuth } from "better-auth";
// import { PrismaClient } from "../../generated/prisma/client";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { prisma } from "./prisma";
// import app from "../app";
// import { toNodeHandler } from "better-auth/node";
// import nodemailer from "nodemailer"
// // // If your Prisma file is located elsewhere, you can change the path
// // import { PrismaClient } from "@/generated/prisma/client";
// // const nodemailer = require("nodemailer");

// // Create a transporter using Ethereal test credentials.
// // For production, replace with your actual SMTP server details.
// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // Use true for port 465, false for port 587
//     auth: {
//         user: process.env.APP_USER,
//         pass: process.env.APP_PASS,
//     },
// });
// // const prisma = new PrismaClient();
// export const auth = betterAuth({
//     database: prismaAdapter(prisma, {
//         provider: "postgresql", // or "mysql", "postgresql", ...etc
//     }),
//     trustedOrigins: [process.env.APP_URL!],
//     user: {
//         additionalFields: {
//             role: {
//                 type: "string",
//                 defaultValue: "user",
//                 required: false,
//             },
//             status: {
//                 type: "boolean",  // Must be "boolean" not "string"
//                 defaultValue: true,  // Must be true not "true"
//                 required: false,
//             },

//             phone: {
//                 type: "string",
//                 required: false,
//             },
//             isActive: {
//                 type: "boolean",
//                 defaultValue: true,
//                 required: false,
//             },
//         },
//     },
//     emailAndPassword: {
//         enabled: true,
//         minPasswordLength: 6,
//         autoSignIn: false,
//         requireEmailVerification: true
//     },
//     advanced: {
//         disableCSRFCheck: true, // Only for development/testing
//     },
//     onError: (error, ctx) => {
//         console.error("BETTER AUTH ERROR:", error);
//         console.error("ERROR CONTEXT:", ctx);
//     },
//     // emailVerification: {
//     //     sendVerificationEmail: async ({ user, url, token }, request) => {
//     //         const info = await transporter.sendMail({
//     //             from: '"Prisma Blog App" <prisma@gmail.com>',
//     //             to: "skmostafa8888@gmail.com",
//     //             subject: "Hello ✔",
//     //             text: "Hello world?", // Plain-text version of the message
//     //             html: "<b>Hello world?</b>", // HTML version of the message
//     //         });

//     //         console.log("Message sent:", info.messageId);
//     //     }
//     // }
//     emailVerification: {
//   sendVerificationEmail: async ({ user, url, token }, request) => {
//     console.log("Sending verification email to:", user.email);
//     console.log("Verification URL:", url);
    
//     const info = await transporter.sendMail({
//       from: '"Prisma Blog App" <process.env.APP_USER>',
//       to: user.email,  // Use actual user email
//       subject: "Verify Your Email for Prisma Blog App",
//       html: `
//         <div style="font-family: Arial, sans-serif;">
//           <h2>Welcome to Prisma Blog App!</h2>
//           <p>Please verify your email by clicking the button below:</p>
//           <a href="${url}" 
//              style="background-color: #4CAF50; color: white; padding: 12px 20px; 
//                     text-decoration: none; border-radius: 5px; display: inline-block;">
//             Verify Email
//           </a>
//           <p>Or copy and paste this link in your browser:</p>
//           <p style="word-break: break-all;">${url}</p>
//           <p>This link will expire in 24 hours.</p>
//         </div>
//       `,
//     });

//     console.log("Message sent to:", user.email, "Message ID:", info.messageId);
//   }
// }
// });

























import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@ph.com>',
          to: user.email,
          subject: "Please verify your email!",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .header {
      background-color: #0f172a;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
    }

    .content {
      padding: 30px;
      color: #334155;
      line-height: 1.6;
    }

    .content h2 {
      margin-top: 0;
      font-size: 20px;
      color: #0f172a;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .verify-button {
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 6px;
      display: inline-block;
    }

    .verify-button:hover {
      background-color: #1d4ed8;
    }

    .footer {
      background-color: #f1f5f9;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
    }

    .link {
      word-break: break-all;
      font-size: 13px;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Prisma Blog</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>
        Hello ${user.name} <br /><br />
        Thank you for registering on <strong>Prisma Blog</strong>.
        Please confirm your email address to activate your account.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn't work, copy and paste the link below into your browser:
      </p>

      <p class="link">
        ${url}
      </p>

      <p>
        This verification link will expire soon for security reasons.
        If you did not create an account, you can safely ignore this email.
      </p>

      <p>
        Regards, <br />
        <strong>Prisma Blog Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2025 Prisma Blog. All rights reserved.
    </div>
  </div>
</body>
</html>`,
        });

        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
  advanced: {
    disableCSRFCheck: true, // Only for development/testing
  },
});







