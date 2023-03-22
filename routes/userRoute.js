const express = require("express")
const userRoute = express()
const session = require("express-session")
const nocache = require("nocache")
userRoute.use(express.static('public'));
const upload = require("../middleware/multer")


const config = "secret2"
userRoute.use(
  session({
     secret: config,
     resave: false,
     saveUninitialized:true,
  })
)
   


const userMidd = require("../middleware/userMidd")
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController")
const wishListController = require("../controllers/wishListController")
const checkOutController = require("../controllers/checkOutController")
const profileController = require("../controllers/profileController")
const orderController = require("../controllers/orderController")



//views is a property of view engin, and set the path of views in that
userRoute.set("views","./views/user")
userRoute.use(express.static('public/user'));







//user request,response and data giving to database working (post,get)
userRoute.get("/",userMidd.isLogout,userController.loadHome)
userRoute.get("/login",userMidd.isLogout,userController.loginLoad)
userRoute.get("/register",userMidd.isLogout,userController.loadRegister)

userRoute.post("/register",userController.insertUser,userController.loadOtp)
userRoute.post("/otp",userMidd.isLogout,userController.verifyOtp)


userRoute.get("/forget",userMidd.isLogout,userController.forgetLoad)
userRoute.post("/forget-password",userMidd.isLogout, userController.forgetVerify)
userRoute.post("/reset-password",userMidd.isLogout,userController.forgetPasswordLoad)
userRoute.post("/reset-newpassword",userMidd.isLogout,userController.resetPassword)
userRoute.post("/login",userController.verifyLogin) 




userRoute.use(userMidd.isBlock)

userRoute.get("/home",userController.loadHome)
userRoute.get("/logout",userMidd.isLogin,userController.userLogout)

userRoute.get("/shop", userController.shop)
userRoute.get("/single-product",userController.singleProduct)
// userRoute.get("/banner",userMidd.isLogin,userController.loadBanner)
userRoute.get("/cart",userMidd.isLogin,cartController.loadCart)
userRoute.post("/updateCart",userMidd.isLogin,cartController.updateCart)

userRoute.get("/addCart",userMidd.isLogin,upload.uploads.array("gImage",5),cartController.addCart)
userRoute.post("/editCart",cartController.editCart)
userRoute.get("/deleteCart",userMidd.isLogin,cartController.deleteCart)
userRoute.get("/wishList",userMidd.isLogin,wishListController.loadWishList)
userRoute.get("/addToWishList",userMidd.isLogin,wishListController.addToWishList)
userRoute.get("/deleteWish",userMidd.isLogin,wishListController.deleteWish)
userRoute.get("/addcartDeletewishlist",userMidd.isLogin,wishListController.addcartDeletewishlist)

userRoute.get("/checkOut",userMidd.isLogin,checkOutController.checkOutLoad)
userRoute.post("/addAddress",userMidd.isLogin,checkOutController.addAddress)
userRoute.post("/order",userMidd.isLogin,checkOutController.order)
// userRoute.get("/confirmation",userMidd.isLogin,checkOutController.confirmation)

userRoute.get("/profile",userMidd.isLogin,profileController.profile)
userRoute.post("/addProfileAdress",userMidd.isLogin,profileController.addProfileAddress)
userRoute.get("/delectAddress",userMidd.isLogin,profileController.delectAddress)
userRoute.get('/paypal',userMidd.isLogin,checkOutController.onlinePayment)


userRoute.get("/cancelOrder",userMidd.isLogin,orderController.cancelOrder)
userRoute.get("/userViewOrder",userMidd.isLogin,orderController.userViewOrder)
userRoute.get("/returnOrder",userMidd.isLogin,orderController.returnOrder)



module.exports = userRoute



