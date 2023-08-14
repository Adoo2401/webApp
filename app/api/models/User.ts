import mongoose, { SchemaTypeOptions } from "mongoose";

const userSchema = new mongoose.Schema({

    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:String,
    role:{type:String,required:true,default:"user"},
    plan:{type:String,required:true,enum:['basic','pro',"premium","none"],default:"none"},
    paymentGateway:{type:String,enum:['stripe',"youcan"]},
    stripeCustomerId:{type:String},
    stripeSubscriptionId:{type:String},
    stripePriceId:{type:String},
    stripeCurrentPeriodEnd:{type:Date},
    codeInAfricaApiKey:{type:String},
    codeInAfricaSecretKey:{type:String}

},{timestamps:true})


const User = mongoose.models.user || mongoose.model("user",userSchema);
export default User