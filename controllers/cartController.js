const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");
const PRODUCT = require("../models/productModel");
const COUPON = require("../models/couponModel")

const loadCart = async(req,res)=>{
  try {
    if(req.session.user){check = true}else {check = false}
    if(req.session.user_id){
        const userData=await USER.findById({_id:req.session.user_id})
        const completeUser=await userData.populate('cart.item.productId')
        // const Coupon = await COUPON.find()
        // console.log(coupon);
        res.render('cart',{user:check,id:req.session.user_id,cartProducts:completeUser.cart,})
    }else{
        res.redirect('/login')
    }
  } catch (error) {
   console.log(error.message); 
  }
}

const updateCart=async(req,res)=>{
  try{
    // let quantity = req.body.quantity
      let {quantity,_id} = req.body
      console.log("quan==="+quantity);
      console.log("id======"+_id);
      const userData=await USER.findById({_id:req.session.user_id})
      const total=await userData.updateCart(_id,quantity)
      res.json({total})

  }catch(error){
      console.log(error);
  }
}

const addCart = async(req,res)=>{
  try {
    if(req.session.user1){check=true} else check=false;
    const productId=req.query.id
    userSession=req.session
    if(userSession.user_id){
        const userData=await USER.findById({_id:userSession.user_id})
        const productdata=await PRODUCT.findById({_id:productId})

        userData.addToCart(productdata)
        res.redirect('/shop')
    }else{
        res.redirect('/login')
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

const editCart=async(req,res)=>{
  try {
      const id=req.query.id
      userSession=req.session
      const userData=await USER.findById({_id:userSession.user_id})
      const foundProduct=userData.cart.item.findIndex((objInItems)=>objInItems._id == id)
      userData.cart.item[foundProduct].qty=req.body.qty
      userData.cart.totalPrice=0
      const totalPrice=userData.cart.item.reduce((acc,curr)=>{
          return acc+curr.price*curr.qty
      },0)

      userData.cart.totalPrice=totalPrice
      await userData.save()
      res.redirect('/cart')
  } catch (error) {
      console.log(error.message)
  }
}

const deleteCart =async(req,res)=>{
  try {
    const productId = req.query.id
    userSession = req.session
    const userData = await USER.findById({_id:userSession.user_id})
    userData.removefromCart(productId)
    res.redirect("/cart")
  } catch (error) {
    console.log(error.message)
  }
}

module.exports={
  loadCart,
  addCart,
  editCart,
  deleteCart,
  updateCart,
}