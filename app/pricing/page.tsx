import Navbar from '@/components/Navbar'
import PricingComponent from './PricingComponent'

const page = () => {
  return (
    <>
    <Navbar isHome={false}/>
    <PricingComponent/>
    </>
  )
}

export default page

export const dynamic = "force-dynamic"