const mongoose=require("mongoose");
const bookingSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    busName:{
        type:String,
        required:true
    },
    start:{
        type:String,
        required:true
    },
    end:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    seats:{
        type:Number,
        required:true
    }

})

const bookingModel=mongoose.model("booking",bookingSchema)

module.exports=bookingModel