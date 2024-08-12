var mongoose = require("mongoose");
var userdetailSchema=mongoose.Schema({
    username:"string",
    number:"string",
    password:"string",
    ncourse:["string"]

})
const Userdetail=mongoose.model("Userdetail",userdetailSchema)
module.exports=Userdetail;