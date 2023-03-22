const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");
const PRODUCT = require("../models/productModel");
const COUPON = require("../models/couponModel")
const ORDER = require("../models/orderModel")
const ADDRESS = require("../models/addressModel")


const profile = async(req,res)=>{
  try {
    

    const userid = req.session.user_id
    if(req.session.user_id){
    if(req.session.user){check = true}else {check = false}
    const User = await USER.findById({_id:req.session.user_id})
    const preAddress = await ADDRESS.find({userId:userid})
    const userOrder = await ORDER.find({userId:userid}).sort({createdAt:-1}).populate("products.item.productId")

    res.render("profile",{user:check,user:User,userorders:userOrder,address:preAddress})
    }
  } catch (error) {
    console.log(error.message);
  }
}


const addProfileAddress =async(req,res)=>{
  try {
    if(req.session.user){check = true}else {check = false}
    const userid = req.session.user_id

    const address = new ADDRESS ({
      userId:userid,
      firstname:req.body.cfirstname,
      lastname:req.body.clastname,
      country:req.body.ccountry,
      address:req.body.caddress,
      city:req.body.ccity,
      state:req.body.cstate,
      zip:req.body.czip,
      mobile:req.body.cmobile,
      district:req.body.cdistrict,
    })
     const orderData = await address.save()
     if(orderData){
      res.redirect("/profile")
     }
  } catch (error) {
    console.log(error.message);
  }
}

const delectAddress = async(req,res)=>{
  try {
    id= req.query.id
    console.log(id);
    const address = await ADDRESS.deleteOne({_id:id})
    res.redirect("/profile")
  } catch (error) {
    console.log(error.message);
  }
}


module.exports ={
  profile,
  addProfileAddress,
  delectAddress,
  
}