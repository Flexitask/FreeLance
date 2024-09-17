const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Chat = require("./Chat")

const ClientSchema = new Schema({
    username :{
       type: String,
       required: true,
    },
    image :{
        type : String,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    Company : {
        type : String,
    },
    //rest is the relationship with other schemas
    messages : [
        {
            type: Schema.Types.ObjectId,
            ref : "Chat",
        }
    ],
    projects : [
        {
            type: Schema.Types.ObjectId,
            ref : "Project",
        }
    ],

})

ClientSchema.post("findOneAndDelete",async (Client)=>{
    if(Client){
        await Chat.deleteMany({_id : {$in: Client.messages}});
    }
}) // to automatically delete all the messages on deletion of client profile

const Client = mongoose.model("Client",ClientSchema);
module.exports=Client;