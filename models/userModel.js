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
  }
})

module.exports = mongoose.model("user",userSchema)