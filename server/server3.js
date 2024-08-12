var express = require("express");
var app = express();

var mongoose = require('mongoose')
app.set("view engine","pug")

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

var userdetail = require("./models/userdetail.model");
const nadmin = require("./models/nadmin.model");
// const Parser = require("parser");
const coursedetail=require("./models/coursedetail.model");

const purchase=require("./models/purchase.model")


var cookieParser = require("cookie-parser");
// const e = require("express");
app.use(cookieParser())



app.get("/",(req,res)=>{
    if(req.cookies.username){
        var details={}
        details.username=req.cookies.username
        details.password=req.cookies.password
        res.render("usersdash.pug")

    }
    else{
        if(req.cookies.adminname){
            var admindetails={}
            admindetails.adminname=req.cookies.adminname
            admindetails.password=req.cookies.password
            res.render("admindashboard.pug")
        }
        else{
            
            res.render("homedash.pug")
        }
    }
   

})

app.get("/register",function(req,res){
    res.sendFile(__dirname+"/public/register.html")
})

app.post("/reg",function(req,res){
    // console.log(req.body)
    mongoose.connect("mongodb://localhost:27017/").then(function(){
        var newuserdetail =new userdetail(req.body);
        newuserdetail.save().then(() => {
            res.sendFile(__dirname+ "/public/login.html")
            // res.send("store")
            
        })
    }) 
 })
 app.get("/login",(req,res)=>{
    res.sendFile(__dirname+"/public/login.html")
 })

 function admincheck(req,res,next){
   if(req.cookies.adminname){
    console.log("nenu admin ra babu")
    next()
   }
   else{
    redirect("/")
   }
 }

 function usercheck(req,res,next){
    if(req.cookies.username){
        console.log(" user ")
        next()
    }
    else{
        redirect("/")
    }
 }

//check here who is login: admin or user: if he is user display userdash else if 
//admin dash else normal dash board

 app.post("/login",function(req,res){

    var name=req.body.username
    var pwd=req.body.password
    
    mongoose.connect("mongodb://localhost:27017/").then(function(){
        userdetail.findOne({username:name, $and:[{password:pwd}] }).then(function(userdata){
            if(userdata){
                res.cookie("username",userdata.username)
                res.cookie("password",userdata.password)
                    res.render("usersdash.pug",{userdetails:userdata})
                
            }
            
         else {
             nadmin.findOne({adminname:name, $and:[{password:pwd}]}).then((admindata)=>{
                    // console.log(admindata)
            if(admindata){
            res.cookie("adminname",admindata.adminname)
            res.cookie("password",admindata.password)
                res.render("admindashboard.pug",{nadmin:admindata})
            }
                
            else{
                res.redirect("/")
            }
        })
      }
    })
  })
})

//ADD NEW COURSES by admin
app.get("/cd",admincheck,(req,res)=>{
    res.sendFile(__dirname+"/public/addcourses.html")
})

app.post("/cd",admincheck,function(req,res){
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        var newcoursedetail =new coursedetail(req.body);
        newcoursedetail.save().then((data)=>{
            // res.render("coursesdash")
            res.send("store aindi")
            
        })
    })

})

//view courses in dashboard

app.get("/admincdash",admincheck,(req,res)=>{
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        coursedetail.find({}).then((acd)=>{
            console.log(acd)
            res.render("acoursesdashboard.pug",{coursedetail:acd})
        })
    })
})
//delete a course by admin

app.get("/delete/:coursename",admincheck,(req,res)=>{
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        coursedetail.findOneAndDelete({coursename:req.params.coursename}).then((coursedelete)=>{
            console.log(coursedelete)
        })
        res.redirect("/admincdash")
    })
})




//admin approve
app.get("/approveform",admincheck,(req,res)=>{
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        purchase.find({}).then((appdata)=>{
            // console.log(appdata)
            res.render("approveform.pug",{purchases:appdata})
        })
    })
})


app.get("/usersform",admincheck,(req,res)=>{
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        userdetail.find({}).then((ud)=>{
            res.render("users.pug",{userdetail:ud})
        })
    })
})

//admin delete user
app.get("/deleteuser/:username",admincheck,(req,res)=>{
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        
        userdetail.findOneAndDelete({username:req.params.username}).then((ddd)=>{
            console.log(ddd)
        })
        res.redirect("/usersform")
    })
})

//admin approve purchase course

app.get("/approve/:coursename/:username",admincheck,(req,res)=>{
    
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        userdetail.findOneAndUpdate({username:req.params.username},{$push:{"ncourse":req.params.coursename}}).then((data1)=>{
            // console.log(data1)
        purchase.findOneAndDelete({username:req.params.username}).then((dldata)=>{
            console.log(dldata)
            res.redirect("/approveform")
        })
        })
    })

})


//approve delete
app.get("/approvaldelete/:coursename",admincheck,(req,res)=>{
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        purchase.findOneAndDelete({coursename:req.params.coursename}).then(()=>{
            res.redirect("/approveform")
        })
    })
})





//user

app.get("/cdash",usercheck,(req,res)=>{
    var details={}
    details.username=req.cookies.username
    // console.log(details)
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        coursedetail.find({}).then((adata)=>{
            res.render("coursesdash.pug",({coursedetail:adata}))
        })
    })
})

//view more:subcourse

app.get("/sub/:cname",usercheck,(req,res)=>{
    var details={}
    details.username=req.cookies.username
    
    // console.log(details)
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        coursedetail.find({coursename:req.params.cname}).then((sdata)=>{
            //  console.log(sdata)
            
                res.render("subcourse.pug",({courseinfo:sdata}))
            // })
        })
    })
})
app.get("/udash",usercheck,(req,res)=>{
    var details={}
    details.username = req.cookies.username
    //  console.log(req.cookies.username)
    mongoose.connect("mongodb://localhost:27017/").then((data)=>{
        userdetail.find({username:req.cookies.username}).then((ud)=>{
            //  console.log(ud)
            res.render("usersdash.pug",{userdetails:ud})
        })
    })
})

//purchase

app.get("/purchase/:cname",usercheck,(req,res)=>{
    var username=req.cookies.username
    var coursename=req.params.cname
    
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        coursedetail.find({coursename:req.params.cname}).then((pdata)=>{
        const newpurchase = new purchase({
            username:username,
            coursename:coursename,
        // console.log(pdata)
        })
        newpurchase.save();
        
    })
})
    res.redirect("/udash")
})

//your courses

app.get("/yourcourses",usercheck,(req,res)=>{
    mongoose.connect("mongodb://localhost:27017/").then(()=>{
        userdetail.findOne({username:req.cookies.username}).then((yc)=>{
            console.log(yc)
            res.render("yourcourses.pug",{userdetails:yc})
        })
    })
})

// 6. logout action
app.get('/logout', (req, res) => {
    // Clear the cookies by setting them to an empty string and setting their expiration date to the past

    if (req.cookies.username) {
        res.clearCookie('username');
        res.clearCookie('password');
        res.redirect("/")
    } else {
        res.clearCookie('adminname');
        res.clearCookie('password');
        res.redirect("/")
    }

})

app.listen(9000,()=>{
    console.log("server running on 9000")
})