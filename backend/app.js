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

const path = require("path");

mongoose.connect("mongodb://127.0.0.1:27017/dummy");

let app = express();

app.set("frontend", path.join(__dirname, "../frontend"));
app.use(express.json());
app.use(cors());
app.use(cookie("asdfghjk"));
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
    res.sendFile(app.get("frontend") + "/Developer/devprofile.html");
    //frontend\Developer\devprofile.html
  })
  .post(upload.single("dev[image]"), async (req, res) => {
    const updateUser = new developer(req.body.dev);
    updateUser.image = req.file.path;
    await updateUser.save();
    console.log(updateUser);
    res.send("User updated");
  });
// cloud
app
  .route("/cloudi")
  .get((req,res)=>{
    res.sendFile(app.get("frontend")+"/static/form.html");
  })
  .post(upload.single("image"), async (req,res)=>{
    res.send(req.file.path);
  })

//cloud
app
  .route("/signup")
  .get((req, res) => {
    // Handle GET request if needed
    res.sendFile(app.get("frontend")+"/auth/signup.html");
  })
  .post(async (req, res) => {
    const { username, password, email,category} = req.body;
    console.log(req.body);
    console.log("PAss: ", req.body.password);
    console.log("mail: ", req.body.email);
    console.log("user: ", req.body.username);
    
    const response = signup.safeParse(req.body);

    const hashedPassword = await bcrypt.hash(password, 12);

    if (!response.success) {
      res.send("something went wrong");
      return;
    }

    try {
      let check;
      let newUser;
      if (category === "developer") {
        check = await developer.findOne({ email });
        if (!check) {
          newUser = new developer({
            username,
            email,
            password: hashedPassword,
          });
        }
      } else if (category === "client") {
        check = await client.findOne({ email });
        if (!check) {
          newUser = new client({
            username,
            email,
            password: hashedPassword,
          });
        }
      } else if (category === "admin") {
        check = await admin.findOne({ email });
        if (!check) {
          newUser = new admin({
            username,
            email,
            password: hashedPassword,
          });
        }
      } else {
        res.send("invalid details / credentials please try again later");
        return;
      }

      if (check) {
        res.json({ msg: "user already exists, please login" });
        return;
      }

      await newUser.save();

      const token = jwt.sign(
        {
          email: newUser.email,
          password: newUser.password,
          category:category,
        },
        "qwertyui",
        {
          expiresIn: "1d",
        }
      );

      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      res.cookie("TOKEN", token, {
        path: "/",
        httpOnly: true,
        signed: true,
        expires,
        domain: "localhost",
        // sameSite, secure
      });

      console.log("token generated successfully");
      res.redirect("/");
    } catch (e) {
      res.send(e);
    }
  });

app
  .route("/login")
  .get((req, res) => {
    // Handle GET request if needed
    res.sendFile(app.get("frontend")+ "/auth/login.html");
  })
  .post(async (req, res) => {
    // const token = req.signedCookies.TOKEN;
    // if (!token) {
    //   return res.redirect("/signup");
    // }
    try {
      const { email, password ,category} = req.body;

      if (!email || !password || !category) {
        console.log("Invalid credentials in 1");        
        return res.status(403).json({ message: "Invalid credentials" });
      }

      let user;
      if (category === "developer") {
        user = await developer.findOne({ email });
      } else if (category === "client") {
        user = await client.findOne({ email });
      } else if (category === "admin") {
        user = await admin.findOne({ email });
      }

      if (!user) {  
        console.log("Invalid credentials in 2");
        return res.status(403).json({ message: "Invalid credentials" });
      }

      // console.log(user.password);
      // console.log(password);

      const isCorrect = await bcrypt.compare(password, user.password);
      
      if (!isCorrect) {
        console.log("Invalid credentials in 3");
        return res.status(403).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          email: user.email,
          password: user.password,
          category:category,
        },
        "qwertyui",
        {
          expiresIn: "1d",
        }
      );
      console.log(token)
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      res.cookie("TOKEN", token, {
        path: "/",
        httpOnly: true,
        signed: true,
        expires,
        domain: "localhost",
        // sameSite, secure
      });
      console.log("token generated successfully 4");

      // return res.status(200).json({ message: "Login successful",route: "/" });
      return res.redirect("/");
    } catch (e) {
      console.error(e);
      return res.send("Invalid token, please try again later");
    }
  });

app.route("");
app.listen(8080);
