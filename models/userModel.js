const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

  name: {
    type:String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    require: true
  },
  password:{
    type: String,
    require:true
  },
  block:{
    type: Number,
    default:1,
    require:true
  },
  cart:{
    item:[{
        productId:{
            type:mongoose.Types.ObjectId,
            ref:"product",
            required:true
        },

        qty:{
            type:Number,
            required:true
        },

        price:{
            type:Number
        },
    }],
    totalPrice:{
        type:Number,
        default:0
    }
},
wishList:{
  item:[{
    productId:{
      type:mongoose.Types.ObjectId,
      ref:"product",
      required:true
    }
  }]
}
});


const Product = require("../models/productModel");

userSchema.methods.addToCart = function (product) {
const cart = this.cart
const isExisting = cart.item.findIndex(objInItems => {
    return new String(objInItems.productId).trim() == new String(product._id).trim()
})
if(isExisting >=0){
    cart.item[isExisting].qty +=1
}else{
    cart.item.push({productId:product._id,qty:1,price:product.price})
}
cart.totalPrice += product.price
console.log(typeof (product.price));
console.log("User in schema:",this);
return this.save()
}

userSchema.methods.removefromCart=async function(productId){
const cart=this.cart
const isExisting=cart.item.findIndex(objInItems=> new String(objInItems.productId).trim()===new String(productId).trim())
if(isExisting >=0){
    const prod=await Product.findById(productId)
    cart.totalPrice -= prod.price*cart.item[isExisting].qty
    cart.item.splice(isExisting,1)
    console.log("User in schema:".this);
    return this.save()
}
}

userSchema.methods.addToWishlist = function (product) {
  const wishList = this.wishList
  const isExisting = wishList.item.findIndex(objInItems => {
      return new String(objInItems.productId).trim() == new String(product._id).trim()
  })
  if(isExisting >=0){
      
  }else{
      wishList.item.push({
          productId:product._id,
          price:product.price
      })
  }
  return this.save()
}
userSchema.methods.removefromWishlist =async function (productId){
  const wishList = this.wishList
  const isExisting = wishList.item.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim())
  if(isExisting >= 0){
      const prod = await Product.findById(productId)
      wishList.item.splice(isExisting,1)
      return this.save()
  }
  
}

userSchema.methods.updateCart = async function (id,qty){
  const cart = this.cart
  const product = await Product.findById(id)
  const index = cart.item.findIndex(objInItems => {
      return new String(objInItems.productId).trim() == new String(product._id).trim()
  })
  console.log(id);
  if(qty >cart.item[index].qty ){
      cart.item[index].qty +=1
      cart.totalPrice += product.price
  }else if(qty < cart.item[index].qty){
    cart.item[index].qty -=1
    cart.totalPrice -= product.price
  }
  else{

  }console.log(cart.totalPrice);
   this.save()
   return cart.totalPrice
}


module.exports = mongoose.model("user",userSchema)