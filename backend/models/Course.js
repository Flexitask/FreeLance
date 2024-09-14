const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    coursename :{
       type: String,
       required: true,
    },
    category : {
        type: String,
        required : true,
    },
    price: {
        type : Number,
        required : true,
    },
    platform : {
        type : String, 
        required : true,
    },
    link : {
        type : String, 
        required : true,
    }
})

const Course = mongoose.model("Course",CourseSchema);
module.exports=Course;