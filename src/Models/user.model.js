import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config';

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
        minlength:8
    },
    todos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Todo"
    }]
}, {timestamps:true});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 8)
    next();
})

userSchema.methods.isPassCorrect = async function(password){ 
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function(){
    try {
        return await jwt.sign(
            {
                _id: this._id,
                email: this.email
            },
            process.env.ACCESSTOKENSECRETKEY,
            {
                expiresIn:1*60*60      //1hr into seconds
            }
        )
    } catch (error) {
        throw new Error(500)
    }
}



export const User = mongoose.model("User", userSchema)

/*NOTES:
ALWAYS REMEMBER LAST LINE ME JB HM EXPORT KA CODE LIKHTE HAI TB VARIABLE KA NAAM AUR .MODEL FUNCTION KE ANDAR JO PARAMETER DETE HIA WHA PE 
NAAM SAME HONA CHAHIYE AUR FIRST LETTER CAPITAL HONA CHAHIYE
*/