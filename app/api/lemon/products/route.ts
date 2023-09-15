import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest) {
    try {
        const lemonUrl = `https://api.lemonsqueezy.com/v1/products?filter[store_id]=${process.env.LEMON_STORE_ID}`;
        const headers = {
            "Content-Type": "application/vnd.api+json",
            "Accept": "application/vnd.api+json",
            "Authorization": `Bearer ${process.env.LEMON_API_KEY}`
        }

        let products: any = await fetch(lemonUrl, { headers, cache: "no-cache" });
        products = await products.json();
        
        let response = await Promise.all(
            products.data
              .filter((pr: any) => {
                return pr.attributes.status === "published";
              })
              .map(async (pr: any) => {
        
                let variant: any = await fetch(
                  `https://api.lemonsqueezy.com/v1/variants?filter[product_id]=${pr.id}`,
                  { headers, cache: "no-cache" }
                );
                variant = await variant.json();
            
                variant.data.filter((v: any) => {
                    return v.attributes.product_id == pr.id
                  })
          
                return {
                  name: pr.attributes.name,
                  price: pr.attributes.price_formatted,
                  description: pr.attributes.description,
                  variantId: variant.data.find((v: any) => {
                    return v.attributes.product_id == pr.id
                  }).id
                };
              })
          );

        return NextResponse.json({success:true,message:response})
        

    } catch (error: any) {

        return NextResponse.json({ success: false, message: error.message })
    }
}

export const dynamic = "force-dynamic"