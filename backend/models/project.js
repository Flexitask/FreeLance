const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name :{
       type: String,
       required: true,
    },
    category : {
        type : String,
        required : true,
    },
    price : {
        type: Number,
        required: true, 
    }
})

const Project = mongoose.model("Project",ProjectSchema);
module.exports=Project;