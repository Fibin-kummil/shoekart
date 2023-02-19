const express = require("express")
const adminRout = express()
const session = require("express-session")
const nocache = require("nocache")

const config = "fibinsecret"
adminRout.use(session({
  secret:config,
  resave:false,
  saveUninitialized:true
}))

const adminMidd = require('../middleware/adminMidd')
const adminController = require("../controllers/adminController")

adminRout.use(express.static('public/admin'));

adminRout.set("view engine","ejs")
adminRout.set("views","./views/admin")

adminRout.use(express.json())
adminRout.use(express.urlencoded({extended:true}))
adminRout.use(nocache())

adminRout.get("/",adminMidd.isLogout,adminController.loadLogin)
adminRout.post("/",adminController.verifyLogin)
adminRout.get("/logout",adminMidd.isLogin,adminController.loadLogout)
adminRout.get("/dashboard",adminMidd.isLogin,adminController.loadDashboard)
adminRout.get("/users",adminMidd.isLogin,adminController.loadUsers)
adminRout.get("/block",adminController.blockUser)

adminRout.get("/category",adminMidd.isLogin,adminController.loadCategory)
adminRout.post("/category",adminMidd.isLogin,adminController.addCategory)
adminRout.get("/deleteCategory",adminMidd.isLogin,adminController.deleteCategory)
adminRout.get("/editCategory",adminMidd.isLogin,adminController.editCategory)
adminRout.get("/addCategory",adminMidd.isLogin,adminController.loadAddCategory)
// adminRout.post("/addCategory",adminController.upDateCategory)

module.exports = adminRout