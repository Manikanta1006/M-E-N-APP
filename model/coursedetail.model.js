var mongoose=require("mongoose")
var coursedetailSchema=mongoose.Schema({
    coursename:"string",
    mentor:"string",
    fees:"string",
    duration:"string",
    image:"string",
    videourl:"string",
   
})
const Coursedetail = mongoose.model("Coursedetail",coursedetailSchema)
module.exports=Coursedetail;