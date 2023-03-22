const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");
const products = require("../models/productModel");
const banner =require("../models/bannerModel")
const bannerController = require("../controllers/bannerController")
const { model } = require("mongoose");
const { deleteOne } = require("../models/adminModel");


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
    
    if(bannerData){
      console.log(bannerData);
     res.redirect("/admin/banner")
    }else{
      res.redirectr("/admin/banner")
      
    }
    
  } catch (error) {
    console.log(error.message);
  }
}



const delectBanner = async(req,res)=>{
  try {
    const bannerData = await banner.find()
    const id = req.query.id
    console.log(id);
    await banner.deleteOne({_id:id})
    res.render("banner",{banner:bannerData})
  } catch (error) {
    console.log(error.message);
  }
}

const chooseBanner = async(req,res)=>{
  try{
    const id=req.query.id
  await banner.findOneAndUpdate({block:1},{$set:{block:0}})
  await banner.findByIdAndUpdate({ _id: id },{$set:{block:1}})
  
    res.redirect('/admin/banner')
  }catch(error){
    console.log(error);
  }
}

module.exports = {
  loadBanner,
  addBanner,
  chooseBanner,
  delectBanner,
  
}