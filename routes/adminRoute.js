const express = require("express")
const adminRoute = express()
const session = require("express-session")
const nocache = require("nocache")
const upload = require("../middleware/multer")

const config = "secret1"
adminRoute.use(session({
  secret:config,
  resave:false,
  saveUninitialized:true
}))

const adminMidd = require('../middleware/adminMidd')
const adminController = require("../controllers/adminController")
const bannerController = require("../controllers/bannerController")


adminRoute.use(express.static('public/admin'));


adminRoute.set("views","./views/admin")



adminRoute.get("/",adminMidd.isLogout,adminController.loadLogin)
adminRoute.post("/",adminController.verifyLogin)
adminRoute.get("/logout",adminMidd.isLogin,adminController.loadLogout)
adminRoute.get("/dashboard",adminMidd.isLogin,adminController.loadDashboard)
adminRoute.get("/users",adminMidd.isLogin,adminController.loadUsers)
adminRoute.get("/block",adminController.blockUser)


adminRoute.get("/coupon",adminMidd.isLogin,adminController.loadCoupon)
adminRoute.post("/coupon",adminMidd.isLogin,adminController.addCoupon)
adminRoute.get("/blockCoupon",adminController.blockCoupon)
// adminRoute.post("/editCoupon",adminMidd.isLogin,adminController.editCoupon)
// adminRoute.get("/category",adminMidd.isLogin,adminController.loadCategory)
// adminRoute.post("/category",adminMidd.isLogin,adminController.addCategory)
// adminRoute.get("/deleteCategory",adminMidd.isLogin,adminController.deleteCategory)
// adminRoute.get("/editCategory",adminMidd.isLogin,adminController.editCategory)
// adminRoute.get("/addCategory",adminMidd.isLogin,adminController.loadAddCategory)

adminRoute.get("/banner",adminMidd.isLogin,bannerController.loadBanner)
adminRoute.post("/addbanner",upload.uploads.array("gImage",5),bannerController.addBanner)
adminRoute.get("/blockBanner",adminMidd.isLogin,bannerController.blockBanner)



module.exports = adminRoute

