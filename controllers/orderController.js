const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const message = require("../cofig/sms")
const PRODUCT = require("../models/productModel")
const banner = require("../models/bannerModel")
const Category = require("../models/categoryModel")
const categoryModel = require("../models/categoryModel")
const ORDER = require("../models/orderModel")
const ADDRESS = require("../models/addressModel")
const { models } = require("mongoose")
const { populate } = require("../models/productModel")


const orderList = async(req,res)=>{
  try {
    const Order = await ORDER.find().populate("products.item.productId").sort({createdAt:-1})
    res.render("order",{order:Order})
    
  } catch (error) {
    console.log(error.message);
  }
}

const cancelOrder=async(req,res)=>{
  try {
      const id=req.query.id;
      const orderDetails=await ORDER.findById({_id:id});
      let state="Canceled"
      await ORDER.findByIdAndUpdate({_id:id},{$set:{status:"Canceled"}})
      if(state=="Canceled"){
          const productData = await PRODUCT.find()
          const orderData=await ORDER.findById({_id:id});

              for (let key of orderData.products.item) {
                  for (let prod of productData) {
                      console.log(key.productId);
                      if (new String(prod._id).trim() == new String(key.productId).trim()) {
                          prod.stock = prod.stock + key.qty
                          await prod.save()
                      }
                  }
             }
      }
      if(orderDetails.payment!="cod"){
      userDetails=await USER.findOne({_id:orderDetails.userId});
      const walletData=userDetails.wallet;
      console.log(typeof(walletData)); 
      console.log(walletData);
      console.log(typeof(orderDetails.amount));
      console.log(orderDetails.amount);
      userData =await USER.updateOne({_id:orderDetails.userId},{$set:{wallet:walletData+orderDetails.amount}})

      }
     
      res.redirect("/profile")
  } catch (error) {
      console.log(error.message);
  }
}

const deliveredOrder = async (req, res) => {
  const id = req.query.id;
  await ORDER.updateOne({ _id: id }, { $set: { status: "Delivered" } });
  res.redirect("/admin/orderList");
};


const confirmOrder = async (req, res) => {
  const id = req.query.id;
  await ORDER.updateOne({ _id: id }, { $set: { status: "Comfirmed" } });
  res.redirect("/admin/orderList");
};


const UpdateOrder = async (req, res) => {
  try {
      // const status=req.body.status
      
      let orderId = req.body.orderid;
     const a = await ORDER.findByIdAndUpdate({_id:orderId},{$set:{status:req.body.status}})
      res.redirect("/admin/orderList")
  } catch (error) {
      console.log(error.messaage);
  }
}


const userViewOrder = async(req,res)=>{
  try{
    if(req.session.user){check=true}{check=false}
    const id=req.query.id
    const userData=await ORDER.findOne({_id:id})
    const orderData= await ORDER.findOne({_id:id})
    // const Orderdetails = await PRODUCT.findOne({_id:id})
    console.log("1"+userData);
    await orderData.populate('products.item.productId')
    res.render('userViewOrderDetails',{orderdetails:orderData,users:userData,user:check})
 
    

  }catch(error){
    console.log(error.messaage);
  }
}


const returnOrder=async(req,res)=>{
  try {
      const id=req.query.id;
      const users=req.session.user_id
      const orderDetails=await ORDER.findOne({_id:id});
      console.log(orderDetails);
      const addres = await ADDRESS.findById({_id:users})
      const cancel= await ORDER.findByIdAndUpdate({_id:id},{$set:{status:"Order Return"}})
      await orderDetails.populate('products.item.productId')
      // let state="Order Return"
    //   if(state=="Order Return"){
    //     const productData = await PRODUCT.find()
    //     const orderData=await ORDER.findById({_id:id});

    //         for (let key of orderData.products.item) {
    //             for (let prod of productData) {
    //                 console.log(key.productId);
    //                 if (new String(prod._id).trim() == new String(key.productId).trim()) {
    //                     prod.stock = prod.stock + key.qty
    //                     await prod.save()
    //                 }
    //             }
    //        }
    // }
    // if(state=="Order Return"){
      userDetails=await USER.findOne({_id:orderDetails.userId});
      const walletData=userDetails.wallet;
      console.log(typeof(walletData)); 
      console.log(walletData);
      console.log(typeof(orderDetails.amount));
      console.log(orderDetails.amount);
      userData =await USER.updateOne({_id:orderDetails.userId},{$set:{wallet:walletData+orderDetails.amount}})
  res.redirect("/profile")
} catch (error) {
  console.log(error.message);
}
}
//       res.redirect("/profile")
//   } catch (error) {
//       console.log(error.message);
//   }
// }

const adminViewOrder =async (req,res)=>{
  try {
    
    const id=req.query.id
    const userData=await ORDER.findOne({_id:id})
    const orderData= await ORDER.findOne({_id:id})
    // const productData = await PRODUCT.findOne({_id:id}) 
    // console.log("dfdfd"+productData);
    // const Orderdetails = await PRODUCT.findOne({_id:id})
    console.log("1"+userData);
    await orderData.populate('products.item.productId')
    res.render('adminViewOrderDetails',{orderdetails:orderData,users:userData})
  } catch (error) {
    console.log(error.message);
  }
}

const downloadreport = async(req,res)=>{
  try {
    let{sdate,edate}=req.body
    console.log(100);
    console.log(req.body);
    console.log(sdate,edate);
    const salesreport=await ORDER.find({createdAt:{$gte:sdate,$lte:edate}}).populate('products.item.productId').sort({createdAt:-1})
    console.log(salesreport);
    res.send({ordersdata:salesreport})
  } catch (error) {
    console.log(error.message)
  }
}



module.exports={
  orderList,
  cancelOrder,
  deliveredOrder,
  confirmOrder,
  UpdateOrder,
  userViewOrder,
  returnOrder,
  adminViewOrder,
  downloadreport,
}