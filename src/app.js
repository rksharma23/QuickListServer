import express from "express";
import cors from "cors"
import userRouter from "./routers/user.routes.js"
import todoRouter from "./routers/todo.router.js"
import bodyParser from "body-parser"
import { ApiError } from "./utils/jsonErrorHandler.js";
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser());

app.use(cors({
    origin: 'https://quicklistclient-opdwxcbe1-rksharma23s-projects.vercel.app',
    credentials: true
}))     //THIS IS TO ALLOW THE CROSS ORIGIN ACCESS AND COMES UNDER THE CORS POLICY


app.use(express.json());  // This is necessary to parse JSON body


app.use(bodyParser.urlencoded({ extended: true }));


//INSECURE ROUTES --> USER ROUTES
app.use('/api/user', userRouter)


//SECURED ROUTES -->TODO ROUTES
app.use('/api/user/todos', todoRouter)


//NOTE --> USE THIS AFTER YOU DEFINED ALL YOUR ROUTES, AS THIS MIDDLEWARE IS USED TO CONVERT ANY ERROR INTO JSON FORMAT
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJson());
    }

    // Handle other errors
    return res.status(500).json({
        status: "error",
        success: false,
        statusCode: 500,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV==='development'?err.stack:undefined
    });
});
export default app;