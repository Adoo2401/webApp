

import Navbar from '@/components/Navbar'
import PricingComponent from './PricingComponent'

type Params = {
  searchParams: URLSearchParams,
  params: {
    id:string | undefined
  }
}

const page = ({searchParams,params}:Params) => {

  return (
    <>
    <Navbar isHome={false}/>
    <PricingComponent/>
    </>
  )
}

export default page

export const dynamic = "force-dynamic"