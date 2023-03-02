const express = require("express")
const categoryRoute = express()
const session = require("express-session")
const nocache = require("nocache")

const config = "secret3"
categoryRoute.use(session({
  secret:config,
  resave:false,
  saveUninitialized:true
}))

const adminMidd = require('../middleware/adminMidd')
const categoryController = require("../controllers/categoryController")

categoryRoute.use(express.static('public/admin'));

categoryRoute.set("views","./views/admin")




categoryRoute.get("/",adminMidd.isLogin,categoryController.loadCategory)
// categoryRoute.get("/addCategory",adminMidd.isLogin,categoryController.loadAddCategory)
categoryRoute.post("/",adminMidd.isLogin,categoryController.addCategory)
categoryRoute.get("/deleteCategory",adminMidd.isLogin,categoryController.deleteCategory)
categoryRoute.post("/editCategory",adminMidd.isLogin,categoryController.editCategory)
categoryRoute.get("/loadEditCategory",adminMidd.isLogin,categoryController.loadEditCategory)

module.exports = categoryRoute

