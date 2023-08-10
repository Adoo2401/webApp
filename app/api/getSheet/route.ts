import {GoogleSpreadsheet} from 'google-spreadsheet'
import { NextResponse } from 'next/server';
import {JWT} from 'google-auth-library'


const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

export async function POST (req:Request,res:Response){
    try {

        const userId = req.headers.get("Authorization");   
        if(!userId) {return NextResponse.json({success:false,message:"Unauthorized Request"},{status:401})}
        
        const body = await req.json();

        let {googleSheetId,prefix,apiKey,apiSecret,product,sheetId} = body 
        

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

        const sheet = doc.sheetsById[sheetId || 0]
        if(!sheet) { return NextResponse.json({success:false,message:"Sheet Not found please see that if you have written correct sheet Id"},{status:500}) }
        
        const rows = await sheet.getRows();
        
        let i = number - 1;

        for (const row of rows) {
        
            i++
            const rowData : any = {};

            rowData["orderId"] = row.get("order id") || row.get("Order ID") || row.get("order Id") || row.get("orderId") || row.get("OrderId");
            if(!rowData["orderId"]){return NextResponse.json({success:false,message:"Order Id column not found and it is required make sure you have written it correct in google sheets"},{status:500})}

            rowData["orderId"] = `${store}-${orderCountry}-${i}`

            rowData["source"] = row.get("product url") || row.get("Product URL") || row.get("product URL") || row.get("Product url") || row.get("productUrl") || row.get("productURL") || row.get("ProductUrl")
            if(!rowData["source"]){return NextResponse.json({success:false,message:"Product URL column not found and it is required make sure you have written it correct in google sheets"},{status:500})}

            rowData['fullName'] = row.get("Full name") || row.get("full name") || row.get("full Name") || row.get("fullName") || row.get("Fullname");
            if(!rowData['fullName']) {return NextResponse.json({success:false,message:"Full Name column not found and it is required make sure you have written it correct in google sheets"},{status:500})}

            rowData['phone'] = row.get("Phone") || row.get("phone");
            if(!rowData['phone']) {return NextResponse.json({success:false,message:"Phone column not found and it is required make sure you have written it correct in google sheets"},{status:500})}

    
            rowData['city'] = row.get("City") || row.get("city");

            rowData['items'] = [
              {
                name:product,
                code:row.get("SKU") || row.get("sku") || row.get("Sku"),
                quantity:parseInt(row.get("Total quantity") || row.get("Total Quantity") || row.get("total quantity") || row.get("Totalquantity") || row.get("totalQuantity")),
                price:parseInt(row.get("Total charge") || row.get("total charge") || row.get("Totalcharge") || row.get("totalCharge") || row.get("total Charge"))
              }
            ]

            if(!rowData["items"][0].code || !rowData['items'][0].quantity || !rowData['items'][0].price){return NextResponse.json({success:false,message:"items column not found and it is required make sure you have written it correct in google sheets"},{status:500})}

            rowData['total'] = rowData["items"].reduce((a:number, b:any) => {
              return a+b.price
            },0)

            data.push(rowData);
        }
        
        const promises = data.map(async object => {
          const response = await fetch("https://api.codinafrica.com/api/orders/apicreate",{method:"POST",headers:{"Content-Type":"application/json","x-auth-token":token},body:JSON.stringify(object)});
          return response.text();
        });
    
        const results = await Promise.all(promises);
        let responseMessage = {} ;
        let responseStatus = {};

        results.forEach(result=>{
          let check = JSON.parse(result);
          
          if(check?.content){
            responseMessage = {success:false,message:check?.content};
            responseStatus = {status:500}
            return
          }

          responseMessage = {success:true,message:"Order Created Successfully"},
          responseStatus = {status:200}
        })
       
        return NextResponse.json(responseMessage,responseStatus);
        

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message},{status:500})
    }
}


