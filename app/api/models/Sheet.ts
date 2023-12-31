import mongoose from 'mongoose';

const sheetSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId,ref:"user",required:true},
    orderId:{type:String,required:true,unique:true},
    source:{type:String,required:true},
    fullName:{type:String,required:true},
    phone:{type:String,required:true},
    title:{type:String,required:true,default:"Untitled"},
    city:{type:String},
    items:[
        {
            name:{type:String},
            code:{type:String},
            quantity:{type:Number},
            price:{type:Number}
        }
    ],
    total:{type:Number},
    googleSheetId:{type:String,required:true},
    sheetId:{type:String,required:true},
    idOnGoogleSheet:{type:String},
    isCronjobActive:{type:Boolean,default:true},
    enabled:{type:Boolean,default:true},
    duplicate:{type:Boolean,default:false}
})

const Sheet = mongoose.models.sheet || mongoose.model("sheet",sheetSchema);
export default Sheet