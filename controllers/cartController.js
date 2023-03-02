const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");
const PRODUCT = require("../models/productModel");

const loadCart = async(req,res)=>{
  try {
    if(req.session.user){check = true}else {check = false}
    if(req.session.user_id){
        const userData=await USER.findById({_id:req.session.user_id})
        const completeUser=await userData.populate('cart.item.productId')
        res.render('cart',{user:check,id:req.session.user_id,cartProducts:completeUser.cart})
    }else{
        res.redirect('/login')
    }
  } catch (error) {
   console.log(error.message); 
  }
}

const addCart = async(req,res)=>{
  try {
    if(req.session.user1){check=true} else check=false;
    const productId=req.query.id
    // console.log(productId);
    userSession=req.session
    if(userSession.user_id){
        const userData=await USER.findById({_id:userSession.user_id})
        const productdata=await PRODUCT.findById({_id:productId})

        userData.addToCart(productdata)
        res.redirect('/shop')
    }else{
        res.redirect('/login')
    }
    // if(req.session.user1){check = true}else {check = false}
    // const id = req.query.id

    // userSession=req.session
    //     if(userSession.user_id){
    //         const userData=await USER.findById({_id:userSession.user_id})
        
    // const product = await PRODUCT.findById({_id:id})
    // res.render("cart",{PRODUCT:product,user:check})
    //   }
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
}