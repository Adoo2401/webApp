import mongoose, { SchemaTypeOptions } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:String,
    role:{type:String,required:true,default:"user"},
    plan:{type:String,required:true,enum:['basic','pro',"premium"]}
},{timestamps:true})


const User = mongoose.models.user || mongoose.model("user",userSchema);
export default User