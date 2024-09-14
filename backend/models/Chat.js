const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    message : {
        type : String,
    }
})

const Chat = mongoose.model("Chat",ChatSchema);
module.exports=Chat;