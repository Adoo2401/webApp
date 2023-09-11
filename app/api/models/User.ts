import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:String,
    role:{type:String,required:true,default:"user"},
    plan:{type:String,required:true,default:"none"},
    paymentGateway:{type:String,enum:['stripe',"lemon"]},
    stripeCustomerId:{type:String},
    stripeSubscriptionId:{type:String},
    stripePriceId:{type:String},
    stripeCurrentPeriodEnd:{type:Date},
    codeInAfricaApiKey:{type:String},
    codeInAfricaSecretKey:{type:String},
    cronJobIsActive:{type:Boolean},
    googleSheetIDs:[],
    sheetIDs:[],
    lemonProductId:{type:String},
    lemonVariantId:String,
    lemonUpdateSubscriptionUrl:String,
    lemonCurrentPeriodEnd:{type:Date}

},{timestamps:true})


const User = mongoose.models.user || mongoose.model("user",userSchema);
export default User