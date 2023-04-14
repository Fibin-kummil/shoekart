const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const message = require("../cofig/sms")
const PRODUCT = require("../models/productModel")
const banner = require("../models/bannerModel")
const Category = require("../models/categoryModel")
const categoryModel = require("../models/categoryModel")

let newUser;


const loginLoad = async(req,res)=>{
  try {
    res.render("login",{message:""}) 
  } catch (error) {
    console.log(error.message);
  }
}
const loadHome = async(req,res)=>{
  try {
    // if(req.session.user){check=true}{check=false}
    bannerData = await banner.find({block:1});
    
    // console.log(bannerData);
    if(req.session.user1){check = true}else {check = false}
   
      res.render("home",{user:check,banner:bannerData})
    
  } catch (error) {
    console.log(error.message);
  }
} 


const loadRegister = async(req,res)=>{
  try {
    res.render("registration",{message:""}) 
  } catch (error) {
    console.log(error.message);
  }
}

const userLogout = async(req,res)=>{
  try {    console.log("logout");

  req.session.user1=null
  req.session.user_id=null
  req.session.user=0
    res.redirect("/")
  } catch (error) {
    console.log(error.message);
  }
}

const verifyLogin = async(req,res)=>{
  try {
    
    const email = req.body.email
    const password = req.body.password
    console.log(req.body);
    const userData = await USER.findOne({email:email})
    console.log(userData);
    if(userData){
      const passwordMatch = await bcrypt.compare(password,userData.password)
      if(passwordMatch){
        // console.log(userData.block);
        if(userData.block){
          req.session.user_id=userData._id
          req.session.user=userData.name
          req.session.user1=true
          // console.log(req.session.user1+"4");
          res.redirect("/home")
        }else{
          res.render("login",{message:"your are blocked"}) 
        }

      }else{
        res.render("login",{message:"password is incorrect"}) 
      }
    }else{
      res.render("login",{message:"email is incorrect"})
    }
  } catch (error) {
    console.log(error.message);
  }
}

const insertUser = async(req,res,next)=>{
  try {
    const name = req.body.name;
    const email =req.body.email;
    const mobile = req.body.mobile;
    const password =req.body.password;

    const validate = await USER.findOne({$or:[{email:email},{name:name},{mobile:mobile}]})
    if(validate){
      res.render("registration",{message:"user already exist"})
    }
     else{
       newUser = {
        name:name,
        email:email,
        mobile:mobile,
        password:password,
      }
    }
   if(newUser){
      next()
    }

  } catch (error) {
    console.log(error.message);
  }
}


const loadOtp = async(req,res)=>{
  const userData = newUser;
  const mobile = userData.mobile
  newOtp = message.sendMessage(mobile,res);
  console.log(newOtp);
  res.render("otp",{newOtp,userData})
}


//verify otp and creat accound 
const verifyOtp = async(req,res)=>{
 
  try {
    
    const otp = newOtp
    console.log(otp);
    console.log(req.body.otp);
    
    if(otp==req.body.otp)
    {
      const password = await bcrypt.hash(req.body.password,10)
      
      console.log(password);
    const user = new USER({
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
      password:password,
    })

    await user.save().then(()=>console.log("register successfull"))
    if(user){
      
      //this is the posion that we creat a session for user
          // if(user.block==1){
            // if(req.session.user_id){check = true}else {check = false}
            req.session.user_id=user._id
            req.session.user=user.name
            req.session.user1=true
            res.redirect("/home")
          // }else{
          //   res.render("login",{message:"your are blocked"}) 
          // }
  
      // res.status(201).redirect("/home")
    }
    else{
      res.status(404).render("otp",{message:"invalid OTP"})
    }
    }else{
      console.log("otp not match");
    }
  } catch (error) {
    console.log(error.message);
  }
}

const forgetLoad = async(req,res)=>{
  try {
    res.render("forget",{message:""})
  } catch (error) {
    console.log(error.message);
  }
}

const forgetVerify = async(req,res)=>{
  try {
    const mobile = req.body.mobile
    const userData = await USER.findOne({mobile:mobile})
    if(userData){
    newOtp = message.sendMessage(mobile,res)
    console.log(newOtp);
    res.render("forget-password",{mobile,newOtp})
  }else {
    res.render("forget",{message:"Invalid phone number" })
  }

  } catch (error) {
    console.log(error.message);
  }
}

const forgetPasswordLoad = async(req,res)=>{
  try {
    const phoneNumber = req.body.phoneNumber;
    const enteredOtp =req.body.otp;
    const newOtp = req.body.newOtp;
    if(enteredOtp==newOtp){
      res.render("reset-password",{ phoneNumber })

    }else{
      res.status(404).render("404")
    }
  } catch (error) {
    console.log(error.message)
  }
}

const resetPassword = async(req,res)=>{
  try {
    // console.log("updatedData");
    const phoneNumber = req.query.id;
    const newPassword = req.body.password;
    const secure_password = await bcrypt.hash(newPassword,10)
    
    const updatedData = await USER.updateOne({mobile:phoneNumber},{$set:{password:secure_password}})
    // console.log("updatedData="+updatedData);
    if(updatedData){
      res.status(200).render("login", { message: "password reset succsefullly", user: req.session.user})
    }else{
      res.render("login", { message: "verification failed", user: req.session.user });
    }
  } catch (error) {
    console.log(error.message);
  }
}

const shop = async (req, res) => {
  try {
      const categoryData = await Category.find()
      let { search, sort, category, limit, page } = req.query
      if (!search) {
          search = ''
      }
      if(!page){
          skip=0
      }else{
          skip=page*3
      }
      console.log(category);
      let arr = []
      if (category) {
          for (i = 0; i < category.length; i++) {
              arr = [...arr, categoryData[category[i]].name]
          }
      } else {
          category = []
          arr = categoryData.map((x) => x.name)
      }
      console.log('sort ' + req.query.sort);
      console.log('category ' + arr);
      if (sort == 0) {
          productData = await PRODUCT.find({  $and: [{ category: arr },{block:1} ,{ $or: [{ productName: { $regex: '.*' + search + ".*" } }, { category: { $regex: "." + search + ".*" } }] }] }).sort({$natural:-1}).skip(skip).limit(3)
          // { $regex: ".*" + search + ".*" }
      } else {
          productData = await PRODUCT.find({  $and: [{ category: arr },{block:1} ,{ $or: [{ productName: { $regex: '.*' + search + ".*" } }, { category: { $regex: "." + search + ".*" } }] }] }).sort({ price: sort }).skip(skip).limit(3)
      }
      console.log(productData.length + ' results found');
      if (req.session.user) { session = req.session.user } else session = false
      res.render('shop', { user: session, products: productData, category: categoryData, val: search, selected: category, order: sort, limit: limit, head: 2 })
  } catch (error) {
      console.log(error.message);
  }
}


// const shop = async (req, res) => {
  
//   try {
//     const productData=await PRODUCT.find({block:1})
//     if(req.session.user){check = true}else {check = false}
//     const category = await Category.find()
//     res.render('shop',{products:productData,user:check,category:category})

// } catch (error) {
//     console.log(error.message)
// }
// }


const singleProduct = async(req,res)=>{
  try {
    const id = req.query.id;
    const details = await PRODUCT.findOne({ _id:id })
    // const products = await PRODUCT.find({ category: details.category });
    // console.log(details);
    if(req.session.user1){check = true}else {check = false}
    res.render("single-product",{PRODUCT:details,user:check});
} catch (error) {
    console.log(error.message);
}
}

// const loadBanner = async (req, res) => {
//   try {
//     // if(req.session.user){check=true} else check=false
//     const bannerData=await banner.find({isAvailable:1})
//     console.log(bannerData);
//     res.render('home',{banners:bannerData})

// } catch (error) {
//     console.log(error.message)
// }
// }








module.exports={
  loginLoad,
  loadHome,
  loadRegister,
  userLogout,
  verifyLogin,
  insertUser,
  loadOtp,
  verifyOtp,
  forgetLoad,
  forgetVerify,
  forgetPasswordLoad,
  resetPassword,
  shop,
  singleProduct,
  
  // loadBanner,
}
