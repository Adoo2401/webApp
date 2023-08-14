import {GoogleSpreadsheet} from 'google-spreadsheet'
import { NextRequest, NextResponse } from 'next/server';
import {JWT} from 'google-auth-library'
import {decode} from 'next-auth/jwt'
import mongoose from 'mongoose';
import Sheet from '../models/Sheet';
import User from '../models/User';

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

export async function POST (req:NextRequest,res:Response){
    try {

      
        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value 
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};
        
        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:accessToken});
        const {id:userId} : any = requestedUser
        
        if(!userId) {return NextResponse.json({success:false,message:"User not found"},{status:400})};
        await mongoose.connect(process.env.MONGODB_URL!)
        
        const body = await req.json();
        
        let {googleSheetId,prefix,apiKey,apiSecret,product,sheetId} = body 
        
        await User.findByIdAndUpdate(userId,{codeInAfricaApiKey:apiKey,codeInAfricaSecretKey:apiSecret},{new:true})

        if(!googleSheetId || !prefix ||!apiKey || !apiSecret || !product ) { return NextResponse.json({success:false,message:"Enter all the fields"},{status:400}) };

        let token : any = await fetch("https://api.codinafrica.com/api/users/apilogin",{method:"POST",body:JSON.stringify({key:apiKey,secret:apiSecret}),headers:{"Content-Type":"application/json"}});
        token = await token.json();
        
        if(!token?.content?.token){
            return NextResponse.json({success:false,message:"Something went wrong while fetching token or Invalid code of africa API key or Secret make sure you enter correct"},{status:400})
        }

        token = token.content.token;

        let data = [];

        const pattern = /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-\d+$/;
        const match = prefix.match(pattern);

        if(!match){return NextResponse.json({success:false,message:"The prefix should be the format of store-country-number e.g shopify-nigeria-0"},{status:500})}

        const [store,orderCountry,number] = prefix.split("-")
       
        const doc = new GoogleSpreadsheet(googleSheetId,serviceAccountAuth);
        await doc.loadInfo();

        let offset = 0;

        offset = (await Sheet.find({userId,googleSheetId,sheetId})).length;
        
        const sheet = doc.sheetsById[sheetId || 0]
        if(!sheet) { return NextResponse.json({success:false,message:"Sheet Not found please see that if you have written correct sheet Id"},{status:500}) }
        
        const rows = await sheet.getRows({offset});
        
        let i = number - 1;

        for (const row of rows) {
        
            i++
            const rowData : any = {};

            rowData["orderId"] = row.get("order id") || row.get("Order ID") || row.get("order Id") || row.get("orderId") || row.get("OrderId");
            if(!rowData["orderId"]){return NextResponse.json({success:false,message:"Order Id column not found and it is required make sure you have written it correct in google sheets"},{status:500});break;}

            rowData["orderId"] = `${store}-${orderCountry}-${i}`
            const orderId = await Sheet.findOne({orderId:rowData["orderId"]});

            if(orderId) { return NextResponse.json({success:false,message:`Can't Added orders because ${rowData["orderId"]} is already added please choose another order id prefix`})  }

            rowData["source"] = row.get("product url") || row.get("Product URL") || row.get("product URL") || row.get("Product url") || row.get("productUrl") || row.get("productURL") || row.get("ProductUrl") || row.get("source") || row.get("Source")
            if(!rowData["source"]){return NextResponse.json({success:false,message:`Product URL column not found of order id ${rowData["orderId"]} and it is required make sure you have written it correct in google sheets`},{status:500});break;}

            rowData['fullName'] = row.get("Full name") || row.get("full name") || row.get("full Name") || row.get("fullName") || row.get("Fullname");
            if(!rowData['fullName']) {return NextResponse.json({success:false,message:`Full Name column not found of order id ${rowData["orderId"]} and it is required make sure you have written it correct in google sheets`},{status:500});break;}

            rowData['phone'] = row.get("Phone") || row.get("phone");
            if(!rowData['phone']) {return NextResponse.json({success:false,message:`Phone column not found of order id ${rowData["orderId"]} and it is required make sure you have written it correct in google sheets`},{status:500});break;}

    
            rowData['city'] = row.get("City") || row.get("city");

            rowData['items'] = [
              {
                name:product,
                code:row.get("SKU") || row.get("sku") || row.get("Sku"),
                quantity:parseInt(row.get("Total quantity") || row.get("Total Quantity") || row.get("total quantity") || row.get("Totalquantity") || row.get("totalQuantity")),
                price:parseInt(row.get("Total charge") || row.get("total charge") || row.get("Totalcharge") || row.get("totalCharge") || row.get("total Charge"))
              }
            ]

            if(!rowData["items"][0].code || !rowData['items'][0].quantity || !rowData['items'][0].price){return NextResponse.json({success:false,message:`Product details not found of order id ${rowData["orderId"]} and it is required make sure you have written price quantity and code and it correct in google sheets`},{status:500});break;}

            rowData['total'] = rowData["items"].reduce((a:number, b:any) => {
              return a+b.price
            },0)

            
            data.push({...rowData,userId,googleSheetId,sheetId});
        }

        await Sheet.insertMany(data);


        // const promises = data.map(async object => {
        //   const response = await fetch("https://api.codinafrica.com/api/orders/apicreate",{method:"POST",headers:{"Content-Type":"application/json","x-auth-token":token},body:JSON.stringify(object)});
        //   return response.text();
        // });
    
        // const results = await Promise.all(promises);
        // let responseMessage = {} ;
        // let responseStatus = {};

        // for(let i=0; i<results.length;i++){
        //   let check = JSON.parse(results[i]);
          
        //   if(check?.content){
        //     responseMessage = {success:false,message:check?.content};
        //     responseStatus = {status:500}
        //     return
        //   }

        //   await Sheet.insertMany(data);
        //   responseMessage = {success:true,message:"Order Created Successfully"},
        //   responseStatus = {status:200}
        // }

        
       
        return NextResponse.json({success:true,message:"come here"});
        

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message},{status:500})
    }
}


