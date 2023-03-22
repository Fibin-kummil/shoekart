const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");
const PRODUCT = require("../models/productModel");


const loadWishList = async(req,res)=>{
  try {
    if(req.session.user){check = true}else {check = false}
    if(req.session.user_id){
      const userData=await USER.findById({_id:req.session.user_id})
      const completeUser=await userData.populate('wishList.item.productId')
      res.render('wishList',{user:check,id:req.session.user_id,cartProducts:completeUser.wishList})
  }else{
      res.redirect('/login')
  }
  } catch (error) {
    console.log(error.message);
  }
}

const addToWishList = async(req,res)=>{
  try {
    if(req.session.user1){check=true} else check=false;
    const productId=req.query.id
    userSession=req.session
    if(userSession.user_id){
        const userData=await USER.findById({_id:userSession.user_id})
        const productdata=await PRODUCT.findById({_id:productId})
console.log(productdata);console.log(userData);
        userData.addToWishlist(productdata)
        res.redirect('/wishList')
    }else{
        res.redirect('/login')
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

const deleteWish = async(req,res)=>{
  try {
    const productId = req.query.id
    userSession = req.session
    const userData = await USER.findById({_id:userSession.user_id})
    userData.removefromWishlist(productId)
    res.redirect("/wishList")
  } catch (error) {
    console.log(error.message)
  }
}

const addcartDeletewishlist = async (req, res) => {
  try {
    const userSession = req.session;
    const productId = req.query.id;
    const userdata = await USER.findById(userSession.user_id);
    const productdata = await PRODUCT.findById(productId);
    if (!userdata || !productdata) {
      return res.status(404).send("User or product not found");
    }
    await userdata.addToCart(productdata, 1);
    await userdata.removefromWishlist(productId);
    res.redirect("/wishList");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};


module.exports={
  loadWishList,
  addToWishList,
  deleteWish,
  addcartDeletewishlist,
}