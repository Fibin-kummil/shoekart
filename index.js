const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/1st_project_database");


const express = require("express");
const app = express();

app.use(express.static('public/user'));
app.use(express.static('public/admin'));
// app.set("view engine", "ejs");
// app.set("views", "./views/admin");
// app.use('/admin',(req ,res)=>{
//    res.render('index')
// })


// for user routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

// for admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

app.listen(5000, function () {
  console.log("Ready To Run The Server 5000 ");
});
