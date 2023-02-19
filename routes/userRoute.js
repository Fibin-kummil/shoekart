const express = require("express")
const userRoute = express()
const session = require("express-session")
const nocache = require("nocache")
userRoute.use(express.static('public'));


const config = "fibinsecret"
userRoute.use(
  session({
     secret: config,
     resave: false,
     saveUninitialized:true,
  })
)
   

//module require for check wether login or logout(middlewares)
const userMidd = require("../middleware/userMidd")
//userContoller require for do the action based on middlewares
const userController = require("../controllers/userController")


//views is a property of view engin, and set the path of views in that
userRoute.set("view engine","ejs")
userRoute.set("views","./views/user")
userRoute.use(express.static('public/user'));


//respons condent will covert it in to req.boady object for converting in to sting array and json format 
userRoute.use(express.json())
userRoute.use(express.urlencoded({extended:true}))
userRoute.use(nocache())



//user request,response and data giving to database working (post,get)
userRoute.get("/",userMidd.isLogout,userController.loadHome)

userRoute.get("/home",userMidd.isLogin,userController.loadHome)

userRoute.get("/login",userMidd.isLogout,userController.loginLoad)

userRoute.get("/logout",userMidd.isLogin,userController.userLogout)

userRoute.get("/register",userMidd.isLogout,userController.loadRegister)


userRoute.post("/login",userController.verifyLogin) 
userRoute.post("/register",userController.insertUser,userController.loadOtp)
userRoute.post("/otp",userMidd.isLogout,userController.verifyOtp)


userRoute.get("/forget",userMidd.isLogout,userController.forgetLoad)
userRoute.post("/forget",userController.forgetVerify)
userRoute.post("/verify-otp",userController.forgetPasswordLoad)
userRoute.post("/reset-password",userController.resetPassword)


module.exports = userRoute



