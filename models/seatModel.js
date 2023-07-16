
const mongoose=require("mongoose")

const seatSchema=new mongoose.Schema({
    busName:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    bookedSeats:{
        type:Array,
        default:[]
    }
})

const seatModel=mongoose.model("seat",seatSchema)

module.exports=seatModel