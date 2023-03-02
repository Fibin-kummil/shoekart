const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");
const products = require("../models/productModel");
const banner =require("../models/bannerModel")
const bannerController = require("../controllers/bannerController")
const { model } = require("mongoose");


const loadBanner =async(req,res)=>{
  try {
    const bannerData = await banner.find()
    if(bannerData){
    res.render("banner",{banner:bannerData})
    }
  } catch (error) {
    console.log(error.message);
  }
}


const addBanner = async(req,res)=>{
  try {
   
    
    const banners = new banner({
      banner:req.body.gName,
      bannerImage:req.files.map((x)=>x.filename)
    })
    console.log("banners");
    const bannerData= await banners.save()
    //const productData =await products.find()
    if(bannerData){
      console.log(bannerData);
     // res.render("products",{message:"Product Added",products:productData,category:categoryData})
     res.redirect("/admin/banner")
    }else{
      res.redirectr("/admin/banner")
      
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

const blockBanner = async(req,res)=>{
  try {
    const id = req.query.id
    const userData = await banner.findOne({_id:id})
    if(userData.block){
      const userData =await banner.findByIdAndUpdate({_id:id},{$set:{block:0}});console.log("block");
    }else{
      await banner.findByIdAndUpdate({_id:id},{$set:{block:1}});console.log("unblock");
    }
    res.redirect("/admin/banner")
  } catch (error) {
    console.log(error.message);
  }
}



module.exports = {
  loadBanner,
  addBanner,
  blockBanner,
}