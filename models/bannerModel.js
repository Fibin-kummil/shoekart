const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    banner:{
        type:String,
        required:true
    },
    bannerImage:{
        type:Array,
        required:true
    },
    block:{
        type:Number,
        default:1,
        required:true
    },
    isAvailable:{
        type:Number,
        default:1
      }
})

module.exports = mongoose.model('Banner',bannerSchema)