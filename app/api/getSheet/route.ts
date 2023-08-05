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

export async function POST (req:Request){
    try {
        
        const body = await req.json();
        const {sheetId,prefix} = body;
        const data = [];

        const doc = new GoogleSpreadsheet(sheetId,serviceAccountAuth);
        await doc.loadInfo();
        
        const sheet = doc.sheetsByIndex[0]

        
        const rows = await sheet.getRows();
        const headerValues = sheet.headerValues;

        for (const row of rows) {
            const rowData : any = {};
        
            headerValues.forEach((header) => {
                if(header=="Order ID" || header=="order id" || header === "Order id" || header === "order Id" || header === "order ID"){
                    rowData[header] = prefix + row.get(header);
                }else{
                    rowData[header] = row.get(header);
                }
            });
        
            data.push(rowData);
        
        }

        return NextResponse.json({success:true,message:data});
        

    } catch (error:any) {
        return NextResponse.json({success:false,error:error.message})
    }
}

