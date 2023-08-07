import mongoose, { SchemaTypeOptions } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:String,
    role:{type:String,required:true,default:"user"},
},{timestamps:true})


const User = mongoose.models.user || mongoose.model("user",userSchema);
export default User