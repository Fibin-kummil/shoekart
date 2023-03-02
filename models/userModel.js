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


module.exports = mongoose.model("user",userSchema)