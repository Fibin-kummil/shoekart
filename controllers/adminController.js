const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel")
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
        res.render("login",{message:"email and password are incorrect"})
      }
    }else{
      res.render("login",{message:"email and password are incorrect"})
    }

  } catch (error) {
    console.log(message.error);
  }
}

const loadDashboard = async(req,res)=>{
  try {
    console.log(req.session.admin_id);
    const adminData =await ADMIN.findById({_id: req.session.admin_id})
    res.render("dashboard",{admin:adminData})
  } catch (error) {
    console.log(error.message);
  }
}

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
      is_admin:0,
      $or:[
        {name:{$regex:".*"+search+".*"}},
        {email:{$regex:".*"+search+".*"}},
        {mobile:{$regex:".*"+search+".*"}},
        
      ]
    })
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
      const userData =await USER.findByIdAndUpdate({_id:id},{$set:{block:0}});console.log("block");
    }else{
      await USER.findByIdAndUpdate({_id:id},{$set:{block:1}});console.log("unblock");
    }
    res.redirect("/admin/users")
  } catch (error) {
    console.log(error.message);
  }
}

const loadCategory = async(req,res)=>{
  try {
    if(req.session.admin_id){
      const categoryAll = await category.find()

      res.render("category",{category:categoryAll})
    }else{
      res.redirect("/admin")
    }
  } catch (error) {
    console.log(error.message);
  }
}

const addCategory = async(req,res)=>{
  const categoryData = await category.findOne({name:req.body.category})
  const categoryAll = await category.find()
  if(categoryData){
    res.render("category",{category:categoryAll,val:"", message:"category is already exist"})
  }else{
  try {
    const Category = new category({
      name: req.body.category,
    })
    await Category.save()
    res.redirect("/admin/category")
  } catch (error) {
    console.log(error.message);
  }
}
}

const deleteCategory = async(req,res)=>{
  try {
    const id =req.query.id
    const deleteCategory = await category.deleteOne({_id:id})

      res.redirect("category")
    
  } catch (error) {
    console.log(error.message);
  }
}

const editCategory = async(req,res)=>{
  try {
    // const id = req.query.id
    const editCategory = await category.updateOne({name:req.body.id},{name:req.body.category})
  } catch (error) {
    console.log(error.message);
  }
}

const loadAddCategory = async(req,res)=>{
  try {
    res.render("addCategory",{addCategory:""})
  } catch (error) {
    console.log(error.message);
  }
}

// const upDateCategory = async(req,res)=>{
//   try {
//     const userData = await category.findByIdAndUpdate({_id:req.query.id},{$set:{name:req.body.addCategory}})
//     console.log(userData);
//     res.redirect("/category")
//   } catch (error) {
//     console.log(error.message);
//   }
// }


module.exports={
  loadLogin,
  verifyLogin,
  loadDashboard,
  loadLogout,
  loadUsers,
  blockUser,
  loadCategory,
  addCategory,
  deleteCategory,
  editCategory,
  loadAddCategory,
  // upDateCategory,
}