const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    razorid : {
        type : String, 
        required : true,
    },
    amount : {
        type : Number,
        required : true,
    },
    project: {
        type: String, 
        required : true,
    },
    Developer : 
    {
        type: Schema.Types.ObjectId,
        ref : "Developer",
    },
    Client : 
    {
        type: Schema.Types.ObjectId,
        ref : "Client",
    },
    platformfee : {
        type : Number, 
        default: 3,
    }
})

const Payment = mongoose.model("Payment",PaymentSchema);
module.exports=Category;