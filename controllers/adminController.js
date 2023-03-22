const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel")
const coupons = require("../models/couponModel")
const PRODUCT = require("../models/productModel")
const ORDER =  require("../models/orderModel")

const loadLogin = async(req,res)=>{
  try {
    res.render("login")
  } catch (error) {
    console.log(error.message); 
  }
}

const verifyLogin = async(req,res)=>{
  try {
    const email = req.body.email 
    const password = req.body.password
    const adminData = await ADMIN.findOne({email:email})
    console.log(adminData);
    if(adminData){
      const passwordMatch = await bcrypt.compare(password,adminData.password)
      if(passwordMatch){
        if(adminData.is_admin===0){
          console.log(adminData.is_admin);
          res.render("login",{message:"email and password incorrect"})
        }else{
          req.session.admin_id = adminData._id
          res.redirect("/admin/dashboard")
        }
      }else{
        console.log('pass wrong');
        res.render("login",{message:"password is incorrect"})
      }
    }else{
      res.render("login",{message:"email is incorrect"})
    }

  } catch (error) {
    console.log(message.error);
  }
}

// const loadDashboard = async(req,res)=>{
//   try {
//     console.log(req.session.admin_id);
//     const adminData =await ADMIN.findById({_id: req.session.admin_id})
//     res.render("dashboard",{admin:adminData})
//   } catch (error) {
//     console.log(error.message);
//   }
// }

const loadDashboard = async (req, res) => {
  try {
    const products = await PRODUCT.find()
    let pds=[],qty=[]
    products.map(x=>{
     pds=[...pds,x.name]
     qty=[...qty,x.stock]
    })
    const arr = [];
    const order = await ORDER.find().populate('products.item.productId');    
    for (let orders of order) {
      for (let product of orders.products.item) {
        const index = arr.findIndex(obj => obj.product == product.productId.productName);
        if (index !== -1) {
          arr[index].qty += product.qty;
        } else {
          arr.push({ product: product.productId.productName, qty: product.qty });
        }
      }
    }
    const key1 = [];
    const key2 = [];
    arr.forEach(obj => {
      key1.push(obj.product);
      key2.push(obj.qty);
    });
    const userData = await USER.findById({ _id: req.session.admin_id });
    res.render("dashboard", { admin: userData,key1,key2,pds,qty});
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogout = async(req,res)=>{
    try {
      req.session.admin_id = null
      res.redirect("/admin")
    } catch (error) {
      console.log(error.message);
    }
}

const loadUsers = async(req,res)=>{
  try {
    var search = ""
    if(req.query.search){
      search = req.query.search
    }
    const userData = await USER.find({
      
      $or: [
        {name:{$regex:".*" + search + ".*"}},
        {email:{$regex:".*" + search + ".*"}},
        {mobile:{$regex:".*" + search + ".*"}},
      ]
    })
    console.log("www",userData);
    // console.log(userData );
    res.render("users",{users:userData})
  } catch (error) {
    console.log(error.message);
  }
}

const blockUser = async(req,res)=>{
  try {
    const id = req.query.id
    const userData = await USER.findOne({_id:id})
    if(userData.block){
      const userData =await USER.findByIdAndUpdate(id,{$set:{block:0}});
      console.log("12345",userData);
    }else{
      await USER.findByIdAndUpdate(id,{$set:{block:1}});console.log("unblock");
    }
    res.redirect("/admin/users")
    // res.render("users")
  } catch (error) {
    console.log(error.message);
  }
}

// const loadCategory = async(req,res)=>{
//   try {
//     if(req.session.admin_id){
//       const categoryAll = await category.find()

//       res.render("category",{category:categoryAll})
//     }else{
//       res.redirect("/admin")
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// const addCategory = async(req,res)=>{
//   const categoryData = await category.findOne({name:req.body.category})
//   const categoryAll = await category.find()
//   if(categoryData){
//     res.render("category",{category:categoryAll,val:"", message:"category is already exist"})
//   }else{
//   try {
//     const Category = new category({
//       name: req.body.category,
//     })
//     await Category.save()
//     res.redirect("/admin/category")
//   } catch (error) {
//     console.log(error.message);
//   }
// }
// }

// const deleteCategory = async(req,res)=>{
//   try {
//     const id =req.query.id
//     const deleteCategory = await category.deleteOne({_id:id})

//       res.redirect("category")
    
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// const editCategory = async(req,res)=>{
//   try {
//     // const id = req.query.id
//     const editCategory = await category.updateOne({name:req.body.id},{name:req.body.category})
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// const loadAddCategory = async(req,res)=>{
//   try {
//     res.render("addCategory",{addCategory:""})
//   } catch (error) {
//     console.log(error.message);
//   }
// }

const loadCoupon =async(req,res)=>{
  try {
    var search = ""
    if(req.query.search){
      search = req.query.search
    }
    const userData = await coupons.find({
      $or: [
        {couponName:{$regex:".*" + search + ".*"}},
      ]
    })
    res.render("coupon",{coupons:userData})
  } catch (error) {
    console.log(error.message);
  }
}


const addCoupon = async(req,res)=>{
  const couponData = await coupons.findOne({name:req.body.couponName})
  const allCoupons = await coupons.find()
  if(couponData){
    res.render("coupon",{coupons:allCoupons,val:"", message:"coupon is already exist"})
  }else{
  try {
    const Coupon = new coupons({
      couponName: req.body.couponName,
      amount:req.body.discountAmount,
      value: req.body.value,
      expiry: req.body.exp,
      discount:req.body.discound,
    })
    await Coupon.save()
    res.redirect("coupon")
  } catch (error) {
    console.log(error.message);
  }
}
}
// const cartData = await userData.populate('cart.item.productId')
// console.log('cart.item.cart.totalPrice'); 
 
const blockCoupon = async(req,res)=>{
  try {
    const id = req.query.id
    const userData = await coupons.findOne({_id:id})
    if(userData.block){
      const userData =await coupons.findByIdAndUpdate({_id:id},{$set:{block:0}});console.log("block");
    }else{
      await coupons.findByIdAndUpdate({_id:id},{$set:{block:1}});console.log("unblock");
    }
    res.redirect("/admin/coupon")
  } catch (error) {
    console.log(error.message);
  }
}



module.exports={
  loadLogin,
  verifyLogin,
  loadDashboard,
  loadLogout,
  loadUsers,
  blockUser,
  loadCoupon,
  addCoupon,
  blockCoupon,
  // loadCategory,
  // addCategory,
  // deleteCategory,
  // editCategory,
  // loadAddCategory,
}