import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express"
import { auth } from "./lib/auth";
import { postRouter } from "./modules/post/post.router";
import cors from "cors";
let app: Application = express();


app.use(cors({
    origin: process.env.APP_URL,     // client side URL
    credentials: true,
}));
app.use(express.json());





app.use("/posts",postRouter);
app.all('/api/auth/*splat', toNodeHandler(auth));
app.get("/", (req,res) => {
    res.send("Hello World...")

})

export default app;