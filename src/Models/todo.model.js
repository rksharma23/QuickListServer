import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String
    },
    status:{
        type: String,
        enum: ['completed', 'active'],
        require: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps:true})
export const Todo = mongoose.model("Todo", todoSchema)

/*NOTES:
ALWAYS REMEMBER LAST LINE ME JB HM EXPORT KA CODE LIKHTE HAI TB VARIABLE KA NAAM AUR .MODEL FUNCTION KE ANDAR JO PARAMETER DETE HIA WHA PE 
NAAM SAME HONA CHAHIYE AUR FIRST LETTER CAPITAL HONA CHAHIYE
*/