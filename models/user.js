import mongoose from "mongoose";
import { createHmac, randomBytes } from 'crypto'
import { type } from "os";

const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: true,
   },
   lastName: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true
   },

   userType: {
      type: String,
      enum: ['Admin','SuperAdmin'],
      required: false,
      default: "Admin"
   },
   status: {
      type: String,
      enum: ['New', 'Active', 'Inactive', 'Deleted'],
      required: false,
      default: "New"
   },
   addedBy:{
      type:String,
      required:false,
      default:null
   },
   salt: {
      type: String
   },
   password: {
      type: String,
      required: true,
   },

}, {
   timestamps: true,
   toJSON: {
      transform(doc, ret) {
         delete ret.password;
         delete ret.salt;
      },
   },
})

userSchema.pre("save", function (next) {
   const user = this;

   if (!user.isModified("password")) return;

   const salt = randomBytes(16).toString();
   const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

   this.salt = salt;
   
   this.password = hashedPassword;

   next();
})


userSchema.static("matchPassword", async function (email, password) {
   const user = await this.findOne({ email })

   if (!user) throw new Error("Incorrect Email!");

   const salt = user.salt;
   const hashedPassword = user.password;

   const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

   if (hashedPassword !== userProvidedHash)  throw new Error("Incorrect password");
     
   return user;
})

const User = mongoose.model('user', userSchema)

export default User;

