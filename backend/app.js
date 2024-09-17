const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const signup = require("./schema_validation/signup");
const developer = require("./models/Developer");
const client = require("./models/Client");
const admin = require("./models/Admin");
const fs = require("fs");

const multer = require('multer');
const { storage } = require("./config/cloudConfig");
const upload = multer({storage});


const {
  uploadClientImage,
  uploadDeveloperImage,
  uploadClientZip,
  uploadDeveloperZip,
} = require("./config/cloudConfig");
const Developer = require("./models/Developer");
mongoose.connect("mongodb://127.0.0.1:27017/dummy");
require("dotenv").config();
let app = express();
app.use(express.json());
app.use(cors());
app.use(cookie());
app.use(express.urlencoded({ extended: true }));

app.post("/api/search/:name", async (req, res) => {
  try {
    const products = await category.find({
      productName: { $regex: req.params.name, $options: "i" },
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
app.post("/api/developer/:dev_id", async (req, res) => {
  let p = await developer.find({ _id: req.params.dev_id });
  res.send(p);
});
app.post("/api/client/:client_id", async (req, res) => {
  let p = await client.find({ _id: req.params.client_id });
  res.send(p);
});
app.post("/api/admin/:admin_id", async (req, res) => {
  let p = await admin.find({ _id: req.params.admin_id });
  res.send(p);
});
app.route("/developer/upload").get((req,res)=>{
  res.sendFile("D:/flexitask/frontend/Developer/devprofile.html")
}).post(upload.single('dev[image]'), async (req, res) => {
  const updateUser= new developer(req.body.dev);
  updateUser.image=req.file.path;
  await updateUser.save();
  console.log(updateUser);
  res.send("User updated");
  
});

app.route("/signup").get((req, res) => {

})
  .post(async (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let category = req.headers.category;
    let response = signup.safeParse(req.body);
    console.log(response);
    if (!response.success) {
      res.send("something went wrong");
      return;
    }
    // let check;
    if (category == "developer") {
      try {
        let check = await developer.findOne({ email: email });
        if (!check) {
          let create = await developer.create({
            username: user,
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: pass,
          });
          let token = jwt.sign(
            { ...req.body, category: category },
            process.env.JWT_KEY
          );
          res.cookie("token", token);
          console.log("token generated successfully");
          res.redirect("/login");
        } else {
          res.json({ msg: "user already exist please login" });
        }
      } catch (e) {
        res.send(e);
      }
    } else if (category == "client") {
      try {
        let check = await client.findOne({ email: email });
        if (!check) {
          let create = await client.create({
            username: user,
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: pass,
          });
          let token = jwt.sign(
            { ...req.body, category: category },
            process.env.JWT_KEY
          );
          res.cookie("token", token);
          console.log("token generated successfully");
          res.redirect("/login");
        } else {
          res.json({ msg: "user already exist please login" });
        }
      } catch (e) {
        res.send(e);
      }
    } else if (category == "admin") {
      try {
        let check = await admin.findOne({ email: email });
        if (!check) {
          let create = await admin.create({
            username: user,
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: pass,
          });
          let token = jwt.sign(
            { ...req.body, category: category },
            process.env.JWT_KEY
          );
          res.cookie("token", token);
          console.log("token generated successfully");
          res.redirect("/login");
        } else {
          res.json({ msg: "user already exist please login" });
        }
      } catch (e) {
        res.send(e);
      }
    } else {
      res.send("invalid details / credention please try again later");
    }
  });
app
  .route("/login")
  .get((req, res) => {})
  .post((req, res) => {
    let token = req.headers.token;
    if (!token) {
      res.redirect("/signup");
    }
    try {
      let decode = jwt.verify(token, process.env.JWT_KEY);
      let email = decode.email;
      let pass = decode.password;
      let category = decode.category;

      let ch_email = await;
    } catch (e) {
      res.send("invalid token please try again later");
    }
  });
app.route("");
app.listen(3000);
