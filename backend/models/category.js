const mongoose=require("mongoose");
const Developer = require("./Developer");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name :{
       type: String,
       required: true,
       enum: ["Front-end", "Back-end", "Logo-design","UI/UX", "Machine Learning","Web-application"],
    },
    clients : [
        {
            type: Schema.Types.ObjectId,
            ref : "Client",
        }
    ],
    Developer : [
        {
            type: Schema.Types.ObjectId,
            ref : "Developer",
        }
    ],
})

const Category = mongoose.model("Category",CategorySchema);
module.exports=Category;