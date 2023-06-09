const ADMIN = require("../models/adminModel");
const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const category = require("../models/categoryModel");
const products = require("../models/productModel")


const loadProducts = async(req,res)=>{
  try {
   
    const categoryData = await category.find()
      const allProducts = await products.find()
    
     
    var search = ""
    if(req.query.search){
      search = req.query.search
    }
    const userData = await products.find({
      $or: [
        {name:{$regex:".*" + search + ".*"}},
        
      ]
    })
   
    res.render("products",{products:allProducts,category:categoryData})
   
    
  } catch (error) {
    console.log(error.message);
  }
}




const addProduct = async(req,res)=>{
  try {
   const categoryData = await category.find()
    
    const Product = new products({
      productName:req.body.gName,
      productDescription:req.body.gDescription,
      stock:req.body.gQuantity,
      price:req.body.gPrice,
      category:req.body.category,
      image:req.files.map((x)=>x.filename)
    })
    
    const productData= await Product.save()
    //const productData =await products.find()
    if(productData){
     // res.render("products",{message:"Product Added",products:productData,category:categoryData})
     res.redirect("/products")
    }else{
      res.redirect("/products")
      
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

const loadEditProduct =async(req,res)=>{
  try {
    
    const categoryData = await category.find()
    const productData =await products.findOne({_id:req.query.id})
    console.log(productData);
    res.render("editProduct",{products:productData,category:categoryData})

  } catch (error) {
    console.log(error.message);
  }
}


const editProduct = async(req,res)=>{
  try {
    if (req.files.length != 0) {
    const productData = await products.findByIdAndUpdate(
      {_id:req.query.id},
      {
        $set:{
          productName:req.body.gName,
          productDescription:req.body.gDescription,
          stock:req.body.gQuantity,
          price:req.body.gPrice,
          category:req.body.category,
          image:req.files.map((x)=>x.filename)
        }
      }
    )
    }else{
      const productData = await products.findByIdAndUpdate(
        {_id:req.query.id},
        {
          $set:{
            productName:req.body.gName,
            productDescription:req.body.gDescription,
            stock:req.body.gQuantity,
            price:req.body.gPrice,
            category:req.body.category,
            
          }
        }
      )
    }
    res.redirect("/products")
  } catch (error) {
    console.log(error.message);
  }
}





const deleteProduct = async(req,res)=>{
  try {
    const id =req.query.id
    console.log(id);
    const deleteCategory = await products.deleteOne({_id:id})
      res.redirect("/products")
  } catch (error) {
    console.log(error.message);
  }
}


const blockProduct = async(req,res)=>{
  try {
    const id = req.query.id
    const productData = await products.findOne({_id:id})
    if(productData.block){
      const productData =await products.findByIdAndUpdate({_id:id},{$set:{block:0}});console.log("block");
    }else{
      await products.findByIdAndUpdate({_id:id},{$set:{block:1}});console.log("unblock");
    }
    res.redirect("/products")
  } catch (error) {
    console.log(error.message);
  }
}

const deletesingleimage=async(req,res)=>{
  try {
    let{itemId,imageName}=req.body
    console.log(itemId,imageName);

    const productData = await products.updateOne({_id:itemId},{$pull:{image:imageName}},{upsert:true})
    console.log(productData);
    res.json({success:true});
  } catch (error) {
    console.log(error.message)
  }
}


module.exports = {
  loadProducts,
  // loadAddProduct,
  addProduct,
  loadEditProduct,
  deleteProduct,
  editProduct,
  blockProduct,
  deletesingleimage,
}

