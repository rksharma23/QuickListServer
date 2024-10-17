import { User } from "../Models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError}  from "../utils/jsonErrorHandler.js"

//Register
const registerUser = asyncHandler(async(req, res, next)=>{
    
    const {userName, email, password} = req.body;

    if(
        [userName, email, password].some((field)=>{
            return !field || field.trim() === "";
        })
    ){
        throw new ApiError(404, "All fields are necessary")
    }
     
    
    const alreadyExists = await User.findOne({email});
    if(alreadyExists){
        throw new ApiError(400, "User with same email already exists")
    }
    // console.log(alreadyExists);
    
    const newUser = await User.create({
        userName,
        email,
        password
    })

    const createdUser = await User.findOne(newUser._id).select("-password");
    if(!createdUser){
        throw new ApiError(503, "Server is too busy, please try again later!!!")
    }

    return res.status(200).json({
        message:"User registerd successfully",
        data: createdUser
    })
})


//Login
const loginUser = asyncHandler(async(req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new ApiError(404, "All fields are necessary")
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400, "Invalid Credentials");
    }
    const isPassCorrect = await user.isPassCorrect(password)
    if(!isPassCorrect){
        throw new ApiError(400, "Invalid User Credentials")
    }    
    
    const accessToken = await user.generateToken()
    const options = {
        httpOnly: true,
        expires: new Date(Date.now()+24*60*60*1000),
        secure: true,
        sameSite: 'None',
    }
    const data = await User.findOne({email}).select("-password")
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .json({message: "User Logged in Successfully", data: data})
})


//Logout
const logoutUser = asyncHandler(async function(req, res, next){
    
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }
    
    return res.status(200)
    .clearCookie("accessToken", options)
    .json({message: "User LoggedOut Successfully !!!"})
})

export {registerUser, loginUser, logoutUser}