const express=require("express");
require('dotenv').config();
const adminurl=require('./routes/admin');
const clienturl=require('./routes/client');
const developerurl=require('./routes/developer');


const app=express();
const PORT=process.env.PORT||3002;

app.use(express.json());

app.use("/admin",adminurl);
app.use("/client",clienturl);
app.use("/developer",developerurl);






app.listen(PORT,()=>{
    console.log(`App listing on port ${PORT}`);
})





