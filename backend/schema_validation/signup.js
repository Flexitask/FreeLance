const zod = require('zod');
let signin=zod.object({
    email:zod.string().email(),
    password:zod.string().min(8, "Password must be at least 8 characters long") // Minimum length
    .max(20, "Password must be at most 20 characters long") // Maximum length
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one uppercase letter
    .regex(/[a-z]/, "Password must contain at least one lowercase letter") // At least one lowercase letter
    .regex(/\d/, "Password must contain at least one number") // At least one number
    .regex(/[\W_]/, "Password must contain at least one special character"),
    firstname:zod.string().min(2,"first name should be atleast of 2 charcacters long")
    .max(15,"maximum of 15 charcter allowed"),
    lastname:zod.string().min(2,"last name should be atleast of 2 charcacters long")
    .max(15,"maximum of 15 charcter allowed")
})
module.exports=signin;