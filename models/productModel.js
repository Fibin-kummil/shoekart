const mongoose = require("mongoose")
 
const productSchema = mongoose.Schema({


  productName: {
    type:String,
    required:true
  },
  productDescription: {
    type:String,
    required:true
  },
  stock:{
    type:Number,
    required:true
  },
  price:{
    type:Number,
    requiredP:true
  },
  category:{
    type:String,
    required:true
  },
  image:{
    type:Array,
    required:true
  },
  block:{
    type:Number,
    default:1
  }
})

module.exports = mongoose.model("product",productSchema)