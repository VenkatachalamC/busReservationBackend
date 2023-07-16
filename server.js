const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const BusModel = require("./models/busModel")
const bookingModel = require("./models/bookingModel")
const userModel = require("./models/userModel")
const seatModel = require("./models/seatModel")
const multer = require("multer")

const app=express()
const storage=multer.memoryStorage()
const upload=multer({
    storage:storage
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb+srv://test:test123@cluster0.kifneti.mongodb.net/busbooking").then((_)=>app.listen(8080))

app.get("/busses/:start/:end",(req,res)=>{
    var start=req.params.start
    var end=req.params.end
    console.log(end);
    BusModel.find({start:start,end:end})
    .then(result=>
        res.send(result))
})

app.post('/bookseats/:busName/:date',(req,res)=>{
    var seats=[]
    console.log(req.body)
    req.body.selectedSeats.forEach(element => {
        seats.push(Number(element))
    });
    seatModel.updateOne({
        busName:req.params.busName,
        date:new Date(req.params.date)
    },{ 
        $push:{bookedSeats:{$each:seats}} 
    }).then(result=>res.send(result))
    var booking=new bookingModel({
        userName:req.body.username,
        busName:req.body.busName,
        start:req.body.start,
        end:req.body.end,
        date:new Date(req.body.date),
        price:Number(req.body.price),
        seats:Number(req.body.seats)
    })
    booking.save()

})
 

app.post("/addbus",upload.single("image"),(req,res)=>{
    console.log(req.file);
    const bus=new BusModel({
        busName:req.body.busName,
        start:req.body.start,
        end:req.body.end,
        price:req.body.price,
        image:{
            data:req.file.buffer,
            contentType:req.file.mimetype
        }
    })
    bus.save()
    .then(result=>res.send(result))
})

app.get("/thumbnail/:busName",(req,res)=>{
    BusModel.find({
        busName:req.params.busName
    },{
        image:1
    }).then(result=>{
        if(result.length>0){
            res.set("Content-Type",result[0].image.contentType)
            res.send(result[0].image.data)
        }
        else{
            res.status(400)
            res.send("")
        }
    })
})
app.get("/getbookedseats/:busName/:date",(req,res)=>{
    seatModel.find({
        busName:req.params.busName,
        date:new Date(req.params.date)
    },{bookedSeats:1,_id:0}).then(result=>{
        if(result.length==0){
            const seat=new seatModel({
                busName:req.params.busName,
                date:new Date(req.params.date)
            })
            seat.save().then(
                result2=>{
                    res.send({"bookedSeats":[]})
                }
            )
        }else{
            res.send(result[0])
        }
    })
})
app.get("/booking/:username",(req,res)=>{
    bookingModel.find({userName:req.params.username}).then(
        result=>res.send(result)
    )
})


app.post("/login",(req,res)=>{
    userModel.findOne({userName:req.body.userName})
    .then(result=>{
        if(result && result.password===req.body.password){
            res.send({status:"ok"})
        }
        else{
            res.status(401)
            res.send({status:"invalid"})
        }
    })
})

app.post("/signup",(req,res)=>{
    const user=new userModel({
        userName:req.body.userName,
        password:req.body.password
    })
    user.save().then(result=>{
        res.send({status:"ok"})
    }).catch({status:"invalid"})
})