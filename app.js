//jshint esversion:6
require('dotenv').config()
const express = require("express");
const app = express();

// const request = require("request");
// const https = require("https")
const encrypt = require("mongoose-encryption")
app.use(express.urlencoded({extended: true}));

app.use("/public",express.static("public"));
// const ejs = require("ejs");
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
// const _ = require("lodash")

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/userDB');
  }

  const userSchema = new mongoose.Schema ({
    email: String,
    password: String
  })



  userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] });

  const User = new mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
  res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
  })

  app.get("/register",(req,res)=>{
    res.render("register");
  })

  app.post("/register",(req,res)=>{
     const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
    })
  })

  app.post("/login", (req,res)=>{
    const usernamecheck = req.body.username;
    const password = req.body.password;

    User.findOne({email: usernamecheck}, (err, foundUser)=>{
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                if(foundUser.password=== password){
                    res.render("secrets")
                }
            }
        }
    })
  })





  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });