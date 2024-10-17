class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong!!!",
        errors = [],
        stack = ""
    ){
        super(message)      //calls the Error constructor(base class)
        this.statusCode = statusCode,
        this.message = message,
        this.errors = errors,
        this.success = false,
        this.data = null

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }

    }


    //THIS WILL CONVERT ANY ERROR IN JSON FORMAT WHITH THE HELP OF MIDDLEWARE USED IN APP.JS FILE, AFTER ALL ROUTES ARE DEFINED.
    toJson() {
        return {
            status: "error",
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors,
            stack: process.env.NODE_ENV === 'development' ? this.stack : undefined // Hide stack trace in production
        };
    }
};
export {ApiError}