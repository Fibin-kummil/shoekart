const USER = require("../models/userModel")
const bcrypt = require("bcrypt")
const message = require("../cofig/sms")


let newUser;


const loginLoad = async(req,res)=>{
  try {
    res.render("login",{message:""}) 
  } catch (error) {
    console.log(error.message);
  }
}
const loadHome = async(req,res)=>{
  try {
    if(req.session.user1){check = true}else {check = false}
      res.render("home",{user:check})
  } catch (error) {
    console.log(error.message);
  }
}

const loadRegister = async(req,res)=>{
  try {
    res.render("registration",{message:""}) 
  } catch (error) {
    console.log(error.message);
  }
}

const userLogout = async(req,res)=>{
  try {    console.log("logout");

    req.session.user1=null
    res.redirect("/")
  } catch (error) {
    console.log(error.message);
  }
}

const verifyLogin = async(req,res)=>{
  try {
    const email = req.body.email
    const password = req.body.password
    console.log(req.body);
    const userData = await USER.findOne({email:email})
    console.log(userData);
    if(userData){
      const passwordMatch = await bcrypt.compare(password,userData.password)
      if(passwordMatch){
        if(userData.block==1){
          req.session.user_id=userData.user_id
          req.session.user=userData.name
          req.session.user1=true
          res.redirect("/home")
        }else{
          res.render("login",{message:"your are blocked"}) 
        }

      }else{
        res.render("login",{message:"password is incorrect"}) 
      }
    }else{
      res.render("login",{message:"email is incorrect"})
    }
  } catch (error) {
    console.log(error.message);
  }
}

const insertUser = async(req,res,next)=>{
  try {
    const name = req.body.name;
    const email =req.body.email;
    const mobile = req.body.mobile;
    const password =req.body.password;

    const validate = await USER.findOne({$or:[{email:email},{password:password},{name:name},{mobile:mobile}]})
    if(validate){
      res.render("registration",{message:"user already exist"})
    }
     else{
       newUser = {
        name:name,
        email:email,
        mobile:mobile,
        password:password,
      }
    }
   if(newUser){
      next()
    }

  } catch (error) {
    console.log(error.message);
  }
}


const loadOtp = async(req,res)=>{
  const userData = newUser;
  const mobile = userData.mobile
  newOtp = message.sendMessage(mobile,res);
  console.log(newOtp);
  res.render("otp",{newOtp,userData})
}



const verifyOtp = async(req,res)=>{
 
  try {
    const otp = newOtp
    console.log(otp);
    console.log(req.body.otp);
    
    if(otp==req.body.otp)
    {
      const password = await bcrypt.hash(req.body.password,10)
      console.log(password);
    const user = new USER({
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
      password:password,
    })
    await user.save().then(()=>console.log("register successfull"))
    if(user){
      // req.session.user_id = user._id;
      
          if(user.block==1){
            req.session.user_id=user.user_id
            req.session.user=user.name
            req.session.user1=true
            res.redirect("/home")
          }else{
            res.render("login",{message:"your are blocked"}) 
          }
  
      res.status(201).redirect("/home")
    }
    else{
      res.status(404).render("otp",{message:"invalid OTP"})
    }
    }else{
      console.log("otp not match");
    }
  } catch (error) {
    console.log(error.message);
  }
}

const forgetLoad = async(req,res)=>{
  try {
    res.render("forget")
  } catch (error) {
    console.log(error.message);
  }
}

const forgetVerify = async(req,res)=>{
  try {
    const mobile = req.body.mobile
    newOtp = message.sendMessage(mobile,res)
    console.log(newOtp);
    res.render("forget-password",{mobile,newOtp})
  } catch (error) {
    console.log(error.message);
  }
}

const forgetPasswordLoad = async(req,res)=>{
  try {
    const phoneNumber = req.body.phoneNumber;
    const enteredOtp =req.body.otp;
    const newOtp = req.body.newOtp;
    if(enteredOtp==newOtp){
      res.render("reset-password",{ phoneNumber })

    }else{
      res.status(404).render("404")
    }
  } catch (error) {
    console.log(error.message)
  }
}

const resetPassword = async(req,res)=>{
  try {
    const phoneNumber = req.query.id;
    const newPassword = req.body.password;
    const secure_password = await bcrypt.hash(newPassword,10)
    const updatedData = await USER.updateOne({mobile:phoneNumber},{$set:{password:secure_password}})
    if(updatedData){
      res.status(200).redirect("/login")
    }
  } catch (error) {
    console.log(error.message);
  }
}



module.exports={
  loginLoad,
  loadHome,
  loadRegister,
  userLogout,
  verifyLogin,
  insertUser,
  loadOtp,
  verifyOtp,
  forgetLoad,
  forgetVerify,
  forgetPasswordLoad,
  resetPassword,
}
