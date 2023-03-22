const express = require("express")
const productsRoute = express()
const session = require("express-session")
const nocache = require("nocache")
const upload = require("../middleware/multer")

const config = "secret4"
productsRoute.use(session({
  secret:config,
  resave:false,
  saveUninitialized:true
}))

const adminMidd = require('../middleware/adminMidd')
const productsController = require("../controllers/productsController")
const { model } = require("mongoose")

productsRoute.use(express.static('public/admin'));

productsRoute.set("views","./views/admin")


productsRoute.get("/",adminMidd.isLogin,productsController.loadProducts)
// productsRoute.get("/add-product",adminMidd.isLogin,productsController.loadAddProduct)
productsRoute.post("/add-product",upload.uploads.array("gImage",5),productsController.addProduct)
productsRoute.get("/editProduct",adminMidd.isLogin,productsController.loadEditProduct)
productsRoute.get("/deleteProduct",adminMidd.isLogin,productsController.deleteProduct)
productsRoute.post("/editProduct",upload.uploads.array("gImage",5),productsController.editProduct)
productsRoute.get("/block",adminMidd.isLogin,productsController.blockProduct)
productsRoute.post("/deletesingleimage",adminMidd.isLogin,productsController.deletesingleimage)

module.exports = productsRoute

