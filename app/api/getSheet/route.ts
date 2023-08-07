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
        
        const body = await req.json();
        let {googleSheetId,prefix,sheetId,apiKey,apiSecret} = body;

        
        if(!googleSheetId || !prefix ||!apiKey || !apiSecret) { return NextResponse.json({success:false,message:"Enter all the fields"},{status:400}) };

        let token : any = await fetch("https://api.codinafrica.com/api/users/apilogin",{method:"POST",body:JSON.stringify({key:apiKey,secret:apiSecret}),headers:{"Content-Type":"application/json"}});
        token = await token.json();
        
        if(!token?.content?.token){
            return NextResponse.json({success:false,message:"Something went wrong while fetching token or Invalid API key or Secret make sure you enter correct"},{status:400})
        }

        token = token.content.token;

        
        
        const data = [];

        const pattern = /^(\D+)-(\d+)$/;
        const match = prefix.match(pattern);

        if(!match){return NextResponse.json({success:false,message:"The prefix should be the format of text-0"},{status:500})}

        const hyphenIndex = prefix.indexOf("-");
        let number : number  = 0;
        
        if (hyphenIndex !== -1) {
          const numberString = prefix.slice(hyphenIndex + 1);
          if (!isNaN(numberString)) {
            number = parseInt(numberString);
          }
        }

    
        const doc = new GoogleSpreadsheet(googleSheetId,serviceAccountAuth);
        await doc.loadInfo();

        const sheet = doc.sheetsById[sheetId || 0]
        if(!sheet) { return NextResponse.json({success:false,message:"Sheet Not found please see that if you have written correct sheet Id"},{status:500}) }
        
        const rows = await sheet.getRows();
        const headerValues = sheet.headerValues;


        if (hyphenIndex !== -1) {
          prefix = prefix.slice(0, hyphenIndex + 1);
        }
        
        let i = 0;
        
        for (const row of rows) {
            i++
            const rowData : any = {};
        
            headerValues.forEach((header,index) => {
                if(header=="Order ID" || header=="order id" || header === "Order id" || header === "order Id" || header === "order ID"){
                    rowData[header] = `${prefix}-${number+i}`;
                }else{
                    rowData[header] = row.get(header);
                }
            });
        
            data.push(rowData);
        
        }
        
        let API = await fetch("https://api.codinafrica.com/api/orders/apicreate",{method:"POST",headers:{"Content-Type":"application/json","x-auth-token":token},body:JSON.stringify({
          orderId:"testingorderId",
          source:"testingsournce",
          fullName:"testingfullName",
          phone:"433434",
          country:"testingcountry",
          city:"testingcity",
          address:"testingaddress",
          items:[{code:"testingcode"}],
          total:1
        })});
        
        let order_id = await API.text();

  
        return NextResponse.json({success:true,message:order_id},{status:200});
        

    } catch (error:any) {
        return NextResponse.json({success:false,error:error.message},{status:500})
    }
}


