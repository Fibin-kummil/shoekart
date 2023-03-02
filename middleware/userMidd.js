
 const USER = require("../models/userModel");


const isLogin = async(req,res,next)=>{
  try {
    if(req.session.user){
      next()
    }else{
      res.redirect("/login")
    }
  } catch (error) {
    console.log(error.message);
  }
}

const isLogout = async (req,res,next)=>{
  try {
    // if(req.session.user1=null){res.render("login",{message:"you are blocked",user:req.session.user})}
    if(req.session.user1){
      res.render("home")
    // }else if (req.session.admin_id) {
    //   res.redirect("/admin/home")
    }
    else{
      next()
    }
  } catch (error) {
    console.log(error.message);
  }
}


const isBlock = async(req,res,next)=>{
  try {
    if(req.session.user1){
      // console.log('block calling');
       const userData = await USER.findOne({_id:req.session.user_id})
      //  console.log(req.session.user_id);
       if(userData.block){
        next()
       }else{
        req.session.user1=null
        req.session.user_id=null
        req.session.user=0
        res.redirect("/login",{message:"you are blocked",user:req.session.user})
       }
    }else{
      
      next()
    }
  } catch (error) {
    console.log(error.message);
  }
}


module.exports ={
  isLogin,
  isLogout,
  isBlock,
}