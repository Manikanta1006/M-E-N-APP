var mongoose=require("mongoose")
var purchaseSchema = mongoose.Schema({
    username:"string",
    coursename:"string"
})
var Purchase =mongoose.model("Purchase",purchaseSchema)
module.exports=Purchase;