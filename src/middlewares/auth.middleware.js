import jwt from "jsonwebtoken"
import { ApiError } from "../utils/jsonErrorHandler.js";
import 'dotenv/config';


const verifyJWT = async function(req, res, next){
    try {
        const token = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];
        if(!token){
            throw new ApiError(403, "Access Denied, no token provided !!!")
        }

        const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRETKEY);
        req.user = decoded;
        next();
    } catch (error) {
        /*
         when you throw an error inside your middleware, you aren't actually sending a response to the client. Instead, you're throwing an error that is likely not being caught properly, which causes your Express app to crash or handle it in the default manner without responding to the request.

         To resolve this issue, you need to pass the error to the next middleware or to your error handling middleware. In Express, when you encounter an error, you should call next(error) so that the error can be processed by your error-handling middleware.
        */
    //    console.log(error);
       
        return next(new ApiError(500, "Unauthorized Access!!!"))
    }
}

export default verifyJWT;