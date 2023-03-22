const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://fibin:fibinkummil@cluster0.ycqoymd.mongodb.net/liberty");
const nocache = require("nocache")

// const path = require('path');

const express = require("express");
const app = express();

app.set("view engine","ejs")

app.use(express.static('public/user'));
app.use(express.static('public/admin'));

// app.use(express.static(path.join(__dirname , 'public/user')));
// app.use(express.static(path.join(__dirname , 'public/admin')));



// app.set("view engine", "ejs");
// app.set("views", "./views/admin");
// app.use('/admin',(req ,res)=>{
//    res.render('index')
// })

// const config = "secret1"
// app.use(
//   session({
//      secret: config,
//      resave: false,
//      saveUninitialized:true,
//   })
// )
  



//respons condent will covert it in to req.boady object for converting in to sting array and json format 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(nocache())

// for user routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

// for admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

//for category route
const categoryRoute = require("./routes/categoryRoute");
app.use("/category", categoryRoute);

//for products route
const productsRoute = require("./routes/productsRoute");
app.use("/products", productsRoute);

app.listen(5000, function () {
  console.log("Ready To Run The Server 5000 ");
});



