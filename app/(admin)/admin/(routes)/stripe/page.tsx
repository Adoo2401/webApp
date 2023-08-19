
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StripeProducts from "./components/StripeProducts"
import CreateStripeProduct from "./components/CreateStripeProduct"
import CreateStripePrice from "./components/CreateStripePrice"


const page = () => {
    return (
        <div className="p-10">
            <Tabs defaultValue="stripe_products" >
                <TabsList>
                    <TabsTrigger value="stripe_products">Stripe Products</TabsTrigger>
                    <TabsTrigger value="create_stripe_product">Create Stripe Product</TabsTrigger>
                    <TabsTrigger value="create_stripe_price">Create Stripe Prices</TabsTrigger>
                </TabsList>

                <TabsContent value="stripe_products"><StripeProducts /></TabsContent>
                <TabsContent value="create_stripe_product"><CreateStripeProduct/></TabsContent>
                <TabsContent value="create_stripe_price"><CreateStripePrice/></TabsContent>
            </Tabs>
        </div>
    )
}

export default page