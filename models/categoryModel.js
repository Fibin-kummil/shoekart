const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  isAvilable: {
    type:Number,
    default:1
  }
})

module.exports = mongoose.model("category",categorySchema)