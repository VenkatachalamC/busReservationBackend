const mongoose=require("mongoose")

const busSchema=new mongoose.Schema({
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
    price:{
        type:Number,
        required:true
    },
    // bookedSeats:{
    //     type:Array,
    //     default:[]
    // }
    image:{
        data:Buffer,
        contentType:String
    }
})

const BusModel=mongoose.model("bus",busSchema);
module.exports=BusModel;