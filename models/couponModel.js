const mongoose = require("mongoose")
 
const couponSchema = mongoose.Schema({


  couponName: {
    type:String,
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  value:{
    type:Number,
    required:true
  },
  discount:{
    type:Number,
    requiredP:true
  },
  status:{
    type:Boolean,
    default:1
  },
  block:{
    type: Number,
    default:1,
    require:true
  }
})

module.exports = mongoose.model("coupon",couponSchema)