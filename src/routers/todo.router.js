import { Router } from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todo.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import multer from "multer"


const todoRouter = Router()
const upload = multer() //MULTER IS NOT ONLY USED TO HANDLE FILE UPLOADS BUT ARE ALSO USED TO HANDLE FORM-DATA;
/*
While body-parser can handle JSON and URL-encoded data, it doesn’t parse form-data specifically, especially when file uploads are involved. For handling form-data, you should use multer, which is a middleware for handling multipart/form-data.

upload.none(): This tells multer that you don’t expect any files in the form-data, just regular text fields. If you are uploading files, you might want to use upload.single('fieldname') or upload.array('fieldname') to handle files.
*/

//ROUTE TO CREATE A NEW TODO
todoRouter.route("/create").post(
    verifyJWT,
    upload.none(),
    createTodo
)

//ROUTE TO READ ALL TODO
todoRouter.route("/get-todos").get(
    verifyJWT,
    getTodos
)

//ROUTE TO UPDATE ANY EXISTING TODO
todoRouter.route("/update-todo").post(
    verifyJWT,
    upload.none(),
    updateTodo
)

//ROUTE TO DELETE ANY EXISTING TODO
todoRouter.route("/delete-todo").post(
    verifyJWT,
    upload.none(),
    deleteTodo
)
export default todoRouter
