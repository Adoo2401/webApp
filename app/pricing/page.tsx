"use client"
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
    <PricingComponent/>
    </>
  )
}

export default page