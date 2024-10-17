import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import multer from "multer"

const router = Router()
const upload = multer() //MULTER IS NOT ONLY USED TO HANDLE FILE UPLOADS BUT ARE ALSO USED TO HANDLE FORM-DATA;
/*
While body-parser can handle JSON and URL-encoded data, it doesn’t parse form-data specifically, especially when file uploads are involved. For handling form-data, you should use multer, which is a middleware for handling multipart/form-data.

upload.none(): This tells multer that you don’t expect any files in the form-data, just regular text fields. If you are uploading files, you might want to use upload.single('fieldname') or upload.array('fieldname') to handle files.
*/


//INSECURE ROUTES --> NO NEED TO LOGIN OR NO JWT VERIFICATION
router.route("/register").post(
    upload.none(),
    registerUser
)

router.route("/login").post(
    upload.none(),
    loginUser
)

//Secured routes --> NEEDS JWT VERIFICATION OR NEED TO BE LOGGED IN 
router.route("/logout").post(
    verifyJWT,
    logoutUser
)

export default router