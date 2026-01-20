import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express"
import { auth } from "./lib/auth";
import { postRouter } from "./modules/post/post.router";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
let app: Application = express();


app.use(cors({
    origin: process.env.APP_URL,     // client side URL
    credentials: true,
}));
app.use(express.json());





app.use("/posts",postRouter);
app.use("/comments",commentRouter);



app.all('/api/auth/*splat', toNodeHandler(auth));
app.get("/", (req,res) => {
    res.send("Hello World...")

})


app.use(notFound)
app.use(errorHandler)

export default app;