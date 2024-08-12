var mongoose=require("mongoose");
var nadminSchema = mongoose.Schema({
    adminname:"string",
    number:"string",
    password:"string"
}) 
const nadmin=new mongoose.model("nadmin",nadminSchema)
module.exports=nadmin;