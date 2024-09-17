const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { storage } = require("./config/cloudConfig");
const upload = multer({ storage });
const signup = require("./schema_validation/signup");
const developer = require("./models/Developer");
const client = require("./models/Client");
const admin = require("./models/Admin");

const {
  uploadClientImage,
  uploadDeveloperImage,
  uploadClientZip,
  uploadDeveloperZip,
} = require("./config/cloudConfig");

const Developer = require("./models/Developer");

mongoose.connect("mongodb://127.0.0.1:27017/dummy");

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
app
  .route("/developer/upload")
  .get((req, res) => {
    res.sendFile("D:/flexitask/frontend/form.html");
  })
  .post(upload.single("image"), async (req, res) => {
    //   const newDev = new Developer(req.body.dev);
    //  / let url = req.file.path;
    //   // let fileName =
    //   newDev.image = url;
    //   await newDev.save();
    console.log(req.body.first);
    // const newUser = developer(req.body.dev)
    // await
    if (req.file) {
      res.send("File uploaded ");
    }
  });

  app.route('/signup')
    .get((req, res) => {
      // Handle GET request if needed
    })
    .post(async (req, res) => {
      const { user, password, email, firstname, lastname } = req.body;
      const category = req.headers.category;
      const response = signup.safeParse(req.body);
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      if (!response.success) {
        res.send('something went wrong');
        return;
      }
  
      try {
        let check;
        let newUser;
        if (category === 'developer') {
          check = await developer.findOne({ email });
          if (!check) {
            newUser = new developer({
              username: user,
              email,
              firstname,
              lastname,
              password: hashedPassword,
            });
          }
        } else if (category === 'client') {
          check = await client.findOne({ email });
          if (!check) {
            newUser = new client({
              username: user,
              email,
              firstname,
              lastname,
              password: hashedPassword,
            });
          }
        } else if (category === 'admin') {
          check = await admin.findOne({ email });
          if (!check) {
            newUser = new admin({
              username: user,
              email,
              firstname,
              lastname,
              password: hashedPassword,
            });
          }
        } else {
          res.send('invalid details / credentials please try again later');
          return;
        }
  
        if (check) {
          res.json({ msg: 'user already exists, please login' });
          return;
        }
  
        await newUser.save();
  
        const token = jwt.sign(
          {
            email: newUser.email,
            password: newUser.password,
            category,
          },
          process.env.JWT_KEY,
          {
            expiresIn: '1d',
          }
        );
  
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
        res.cookie('TOKEN', token, {
          path: '/',
          httpOnly: true,
          signed: true,
          expires,
          domain: process.env.BACKEND_DOMAIN,
          // sameSite, secure
        });
  
        console.log('token generated successfully');
        res.redirect('/');
      } catch (e) {
        res.send(e);
      }
    });
  
app.route('/login')
      .get((req, res) => {
        // Handle GET request if needed
        res.send('Login page');
      })
      .post(async (req, res) => {
        const token = req.signedCookies.TOKEN;
        if (!token) {
          return res.redirect('/signup');
        }
        try {
          const decode = jwt.verify(token, process.env.JWT_KEY);
          const email = decode.email;
          const pass = decode.password;
          const category = decode.category;
    
          // Find the user in the database
          let user;
          if (category === 'developer') {
            user = await developer.findOne({ email, password: pass });
          } else if (category === 'client') {
            user = await client.findOne({ email, password: pass });
          } else if (category === 'admin') {
            user = await admin.findOne({ email, password: pass });
          } else {
            return res.send('Invalid category');
          }
    
          if (!user) {
            return res.send('Invalid credentials');
          }
    
          // If the operation is successful, you can proceed
          res.send('Login successful');
        } catch (e) {
          res.send('Invalid token, please try again later');
        }
      });


app.route("");
app.listen(3000);
