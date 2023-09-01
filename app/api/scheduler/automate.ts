import mongoose from "mongoose"
import User from "../models/User";
import serviceAccountAuth from "../lib/googleServiceAccountAuth";
import { GoogleSpreadsheet } from 'google-spreadsheet'
import Sheet from "../models/Sheet";


async function automate(plan: string) {
    
    await mongoose.connect(process.env.MONGODB_URL!);
    
    let users = await User.find({ plan });

    for (let i = 0; i < users.length; i++) {
       
        try {
            if (users[i].codeInAfricaApiKey && users[i].codeInAfricaSecretKey) {

                let userAddedSheets = await Sheet.find({ userId: users[i]._id , isCronjobActive: true });

                for (let j = 0; j < userAddedSheets.length; j++) {
                

                    try {
                        let currentGoogleSheetID = userAddedSheets[j].googleSheetId;
                        let currentSheetID = userAddedSheets[j].sheetId;
                        let currentUserID = users[i]._id;

                        if (
                            userAddedSheets[j + 1]?.googleSheetId === currentGoogleSheetID &&
                            userAddedSheets[j + 1]?.sheetId === currentSheetID &&
                            users[i]?._id === currentUserID
                        ) {
                            continue;
                        }

                        let token: any = await fetch("https://api.codinafrica.com/api/users/apilogin", { cache: "no-store", method: "POST", body: JSON.stringify({ key: users[i].codeInAfricaApiKey, secret: users[i].codeInAfricaSecretKey }), headers: { "Content-Type": "application/json" } });
                        token = await token.json();

                        if (!token?.content?.token) {
                            continue
                        }

                        const doc = new GoogleSpreadsheet(userAddedSheets[j].googleSheetId, serviceAccountAuth);

                        await doc.loadInfo()

                        let offset = 0;
                        offset = (await Sheet.find({ userId: users[i]._id, googleSheetId: userAddedSheets[j].googleSheetId, sheetId: userAddedSheets[j].sheetId })).length;
                        
                        const highestOrderPrefix = await Sheet.aggregate([
                            {
                                $project: {
                                    orderId: 1,
                                    items: 1,
                                    numericPart: {
                                        $toInt: {
                                            $arrayElemAt: [{ $split: ["$orderId", "-"] }, -1]
                                        }
                                    }
                                }
                            },
                            {
                                $sort: { numericPart: -1 }
                            },
                            {
                                $limit: 1
                            }
                        ]);


                        let prefix = highestOrderPrefix[0].orderId
                        let items = highestOrderPrefix[0].items;

                        const [store, orderCountry, number] = prefix.split("-")

                        const sheet = doc.sheetsById[userAddedSheets[j].sheetId]
                        if (!sheet) { continue }

                        const rows = await sheet.getRows({ offset });


                        let k = parseInt(number);
                        let data: any = [];

                        for (const row of rows) {

                            k = k + 1
                            const rowData: any = {};

                            rowData["orderId"] = row.get("order id") || row.get("Order ID") || row.get("order Id") || row.get("orderId") || row.get("OrderId");

                            let idOnGoogleSheet = row.get("order id") || row.get("Order ID") || row.get("order Id") || row.get("orderId") || row.get("OrderId");
                            const orderId = await Sheet.findOne({ idOnGoogleSheet, userId:users[i]._id, googleSheetId:userAddedSheets[j].googleSheetId,sheetId:userAddedSheets[j].sheetId});
                            if (orderId) {
                                continue
                            }

                            rowData["orderId"] = `${store}-${orderCountry}-${k}`

                            rowData["source"] = row.get("product url") || row.get("Product URL") || row.get("product URL") || row.get("Product url") || row.get("productUrl") || row.get("productURL") || row.get("ProductUrl") || row.get("source") || row.get("Source")

                            rowData['fullName'] = row.get("Full name") || row.get("full name") || row.get("full Name") || row.get("fullName") || row.get("Fullname");

                            rowData['phone'] = row.get("Phone") || row.get("phone");


                            rowData['city'] = row.get("City") || row.get("city");

                            rowData['items'] = [
                                {
                                    name: items[0].name,
                                    code: row.get("SKU") || row.get("sku") || items[0].code,
                                    quantity: parseInt(row.get("Total quantity") || row.get("Total Quantity") || row.get("total quantity") || row.get("Totalquantity") || row.get("totalQuantity") || items[0].quantity),
                                    price: parseInt(row.get("Total charge") || row.get("total charge") || row.get("Totalcharge") || row.get("totalCharge") || row.get("total Charge") || items[0].price)
                                }
                            ]


                            rowData['total'] = rowData["items"].reduce((a: number, b: any) => {
                                return a + b.price
                            }, 0)


                            data.push({ ...rowData,idOnGoogleSheet, userId: users[i]._id, googleSheetId: userAddedSheets[j].googleSheetId, sheetId: userAddedSheets[j].sheetId });

                        }
                        
                        const promises = data.map(async (object: any) => {
                            const response = await fetch("https://api.codinafrica.com/api/orders/apicreate", { cache: "no-store", method: "POST", headers: { "Content-Type": "application/json;charset=utf-8", "x-auth-token": token.content.token }, body: JSON.stringify(object) });
                            return response.text();
                        });

                        let results = await Promise.all(promises);
                        console.log(results);
                        await Sheet.insertMany(data);

                    } catch (error: any) {
                        console.log(error + "second loop");
                        continue;
                    }

                }

            } else {
                continue
            }
        } catch (error) {
            continue;
        }
    }


}

export default automate