import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  
  productId: {
    type: String,
    required: true,
  },
  description: String,
  name: String,
  prices: [
    {
      unit_amount: Number,
      trial: Boolean,
      trialPeriod: Number,
      interval: String,
      priceId: String,
      currency: String,
      features:[],
      active:{type:Boolean,default:true},
    },
  ],
  cronJobId:String,
  noOfSheets:Number
});

const Product = mongoose?.models?.product || mongoose.model("product", productSchema);

export default Product;
