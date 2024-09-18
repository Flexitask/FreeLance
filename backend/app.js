const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const razorpay = require('razorpay');
require("dotenv").config();

const { storage } = require("./config/cloudConfig");
const upload = multer({ storage });
const signup = require("./schema_validation/signup");
const developer = require("./models/Developer");
const client = require("./models/Client");
const admin = require("./models/Admin");
const token_manger=require
const path=require('path');
const Developer = require("./models/Developer");

mongoose.connect("mongodb://127.0.0.1:27017/dummy");

let app = express();

app.set('frontend', path.join(__dirname, '../frontend'));
app.use(express.json());
app.use(cors());
app.use(cookie());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.sendFile(app.get('frontend')+"/index.html")
})


app.post("/api/checkout",async(req,res)=>{
  const instance=new razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET
  })
  let dev=req.body._id;
  let token=req.cookie.TOKEN;
  const decode = jwt.verify(token, process.env.JWT_KEY)

  try{
    if(!instance.orders){
      throw new Error("Razorpay instance is missing the 'orders' method")
    }
    const {amount,currency}=req.body;
    const order=await instance.orders.create({
      amount:amount,
      currency:currency,
      receipt:"reciept#1",
      partial_payment:false,
      notes:{
        key1:`${dev}`,
        key1:`${decode._id}`,
      }
    })
    console.log(order);

    res.status(200).json({
        success: true,
        order
    });
} catch (error) {
    
    if (error.statusCode === 401) {
        console.error("Invalid API Key or Secret. Authentication failed.");
        return res.status(401).json({ error: "Authentication failed. Check API keys." });
    } else {
        console.error("Error occurred:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}
})

app.post("/api/paymentverification",(req, res) => {
const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

// Calculate the expected signature
const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET);
shasum.update(razorpay_order_id + "|" + razorpay_payment_id);
const expectedSignature = shasum.digest('hex');

if (expectedSignature === razorpay_signature) {
    res.status(200).json({ success: true, message: 'Payment verified successfully' });
} else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
}
})
app.post("/api/payment-details",async(req,res)=>{
  console.log(req.body);
  let payment=req.body;
  let create=await payment.create({
      razorid:payment.razorpay_payment_id,
      amount:payment.order.amount,
      Developer:payment.order.notes.key1,
      Client:payment.order.notes.key2
  })
  console.log(create);
  
})

app.get("/api/getkey",(req,res)=>{
  res.status(200).json({key:process.env.RAZORPAY_API_KEY})
})

app.post("/api/search/:name", async (req, res) => {
  try {
    const products = await developer.find({
      category: { $regex: req.params.name, $options: "i" },
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
app.route("/add_data/overview").get((req,res)=>{

}).post((req,res)=>{

})
app.route("/add_data/payment&description").get((req,res)=>{

}).post((req,res)=>{

})

app.route("/developer/upload").get((req,res)=>{
  res.sendFile(app.get('frontend')+"/Developer/devprofile.html");
  //frontend\Developer\devprofile.html
}).post(upload.single('dev[image]'), async (req, res) => {
  const updateUser= new Developer(req.body.dev);
  updateUser.image=req.file.path;
  await updateUser.save();
  console.log(updateUser);
  res.send("User updated");
  
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
            newUser = developer.create({
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
            newUser =client.create({
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
            newUser =admin.create({
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
            _id:newUser._id
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
