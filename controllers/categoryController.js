const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");

// let length

const loadCategory = async(req,res)=>{
  try {
      // if(length){
      //    categoryAll = await category.find()
      //    newLength = categoryAll.length
      //   if(newLength>length)
      //   {
      //     msg=''
      //   }else{
      //     msg='category already exists'
      //   }
      // }else{
      //   categoryAll = await category.find()
      //   length = categoryAll.length
      // }
      categoryAll = await category.find()
      res.render("category",{category:categoryAll})
    var search = ""
    if(req.query.search){
      search = req.query.search
    }
    const userData = await category.find({
      $or: [
        {category:{$regex:".*" + search + ".*"}},
        {email:{$regex:".*" + search + ".*"}},
      ]
    })
    res.render("category",{category:userData })
  } catch (error) {
    console.log(error.message);
  }
}


// const loadAddCategory = async(req,res)=>{
//   try {
//     res.render("addCategory",{addCategory:""})
//   } catch (error) {
//     console.log(error.message);
//   }
// }




const addCategory = async(req,res)=>{
  const categoryData = await category.findOne({name:req.body.category})
  // const categoryAll = await category.find()
  if(categoryData){
    res.redirect("category")
    
  }else{
  try {
    const Category = new category({
      name: req.body.category,
    })
    await Category.save()
    res.redirect("/category")
  } catch (error) {
    console.log(error.message);
  }
}
}

const loadEditCategory =async(req,res)=>{
  try {
    const categoryData = await category.findOne({_id: req.query.id})
    // const productData = await products.findOne({_id: req.query.id})
    res.render("editCategory",{category:categoryData})

  } catch (error) {
    console.log(error.message);
  }
}

const deleteCategory = async(req,res)=>{
  try {
    const id =req.query.id
    console.log(id);
    const deleteCategory = await category.deleteOne({_id:id})

      res.redirect("/category")
  } catch (error) {
    console.log(error.message);
  }
}

const editCategory = async(req,res)=>{
  try {
    const productData = await category.findByIdAndUpdate(
      {_id:req.body.id},
      {
        $set:{
          
          category:req.body.categorys
         
        }
      }
    )
  } catch (error) {
    console.log(error.message);
  }
}





module.exports={
  loadCategory,
  addCategory,
  deleteCategory,
  editCategory,
  // loadAddCategory,
  loadEditCategory,
}