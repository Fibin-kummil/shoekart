const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");
const PRODUCT = require("../models/productModel");
const COUPON = require("../models/couponModel")
const ORDER = require("../models/orderModel")
const ADDRESS =require("../models/addressModel")

const checkOutLoad = async(req,res)=>{
  try {
   
    
    
    if(req.session.user_id){
      if(req.session.user){check = true}else {check = false}
    const userData = await USER.findById({_id:req.session.user_id})
    const cartData = await userData.populate('cart.item.productId')
    id = req.session.user_id
    // console.log("123454",id);
    const preAddress = await ADDRESS.find({userId:id})
    // console.log("21",preAddress);
    // console.log(preAddress);
    // console.log(cartData);

    const Coupon = await COUPON.find()
   
    res.render("checkout",{coupon:Coupon,address:preAddress,cart:cartData.cart,user:check,Wallet:userData})
    }
  } catch (error) {
    console.log(error.message);
  }
}

const addAddress = async(req,res)=>{
  try {
    if(req.session.user_id){
      const userData = await USER.findById({_id:req.session.user_id})
    const Coupon = await COUPON.find()

    id = req.session.user_id
    // console.log("123454",id);
    // const preAddress = await ADDRESS.find({_id:id})
    const cartData = await userData.populate('cart.item.productId')
    const address = new ADDRESS ({
      userId:id,
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
    // console.log(address);
     const orderData = await address.save()
    //  console.log(orderData);
     if(orderData){
      res.redirect("/checkout")
     }
    }
  } catch (error) {
    console.log(error.message);
  }
}


let orderData
const order =async(req,res)=>{
  try { 
    const data = await ADDRESS.findById({_id:req.body.flexRadioDefault})
    const couponData = await COUPON.findOne({_id:req.body.coupon})
    const userData = await USER.findOne({_id:req.session.user_id})
    orderData =  ORDER ({
      userId:req.session.user_id,
      address:data,
      payment:req.body.payment,
      products:userData.cart,
      offer:couponData,
      amount:req.body.totalAmount,
    })
    console.log(100);
   
    // console.log(order);
    if(req.body.payment=='cod'){
      await orderData.save()

      const productData = await userData.populate('cart.item.productId')
      console.log("1"+productData);

      for(let key of productData.cart.item){ 
              console.log('initial stock'+key.productId.stock);
                     
              newStock = key.productId.stock - key.qty
                console.log('final stock'+newStock);
                await PRODUCT.updateOne({_id:key.productId},{$set:{stock:newStock}})
            }
    

    await USER.updateOne({_id:req.session.user_id},{$unset:{cart:1}})
    console.log('order successfully');

   res.render("confirmation")

    }else if(req.body.wallet){
      console.log("order successfulll");
      // const walletAmount = req.body.amount
       w = userData.wallet
       t = orderData.amount
      console.log(w,t);
      if(w>=t){
        w=w-t
        t=0
        await USER.updateOne({_id:req.session.user_id},{$set:{wallet:w}})
      }else{
         bal = t - w
        t = bal 
        await USER.updateOne({_id:req.session.user_id},{$set:{wallet:0}})
        orderData.amount=t
        res.render('onlinePayment',{amount:t})

      }
      
     await orderData.save()
     const productData = await userData.populate('cart.item.productId')
      console.log("1"+productData);

      for(let key of productData.cart.item){ 
              console.log('initial stock'+key.productId.stock);
                     
              newStock = key.productId.stock - key.qty
                console.log('final stock'+newStock);
                await PRODUCT.updateOne({_id:key.productId},{$set:{stock:newStock}})
            }
    
    
    await USER.updateOne({_id:req.session.user_id},{$unset:{cart:1}})
    console.log('order successfull');
    res.render("confirmation")
    }else if(req.body.payment=='paypal'){
      console.log("order successfulls");
      console.log(req.body.totalAmount);
      res.render('onlinePayment',{amount:req.body.totalAmount})
      
    }
  } catch (error) {
    console.log(error.message);
  }
}



 const onlinePayment = async (req,res)=>{
  try {
    
    const productData = await userData.populate('cart.item.productId')
    console.log("1"+productData);

    for(let key of productData.cart.item){ 
            console.log('initial stock'+key.productId.stock);
                   
            newStock = key.productId.stock - key.qty
              console.log('final stock'+newStock);
              await PRODUCT.updateOne({_id:key.productId},{$set:{stock:newStock}})
          }
    await USER.updateOne({_id:req.session.user_id},{$unset:{cart:1}})
    console.log('order successfull');
    await orderData.save()
   res.render("confirmation")
  } catch (error) {
    console.log(error);
  }
 }
// const confirmation = async(req,res)=>{
//   try {
//     if(req.session.user_id){

//       const userData = await USER.findById({_id:req.session.user_id})
//       const cartData = await userData.populate('cart.item.productId')
//       const preAddress = await ADDRESS.find()
//       const Coupon = await COUPON.find()
//       res.render("confirmation",{coupon:Coupon,address:preAddress,cart:cartData.cart,})
//       }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

module.exports={
  checkOutLoad,
  addAddress,
  order,
  onlinePayment,
  
  // confirmation,
}