
const {string, object}=require("zod");


const developerschemaValidation= object({
    username:string().max(8),
    email:string().email("Invalid Email address"),
    password:string()
    .min(6,`Password must be at least 6 digit long`)
    .regex(/[A-Z]/,"Password must have a uppercase letter in it!")
    .regex(/[a-z]/,"Password must have a small letter in it!")
    .regex(/[^A-Za-z0-9]/,"Password must have a special symbol in it")
    
})


module.exports=developerschemaValidation;