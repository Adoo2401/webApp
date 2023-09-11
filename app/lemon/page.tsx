

import Navbar from '@/components/Navbar'
import Lemon from './Lemon'

type Params = {
  searchParams: URLSearchParams,
  params: {
    id:string | undefined
  }
}

const page = () => {

  return (
    <>
    <Navbar isHome={false}/>
    <Lemon/>
    </>
  )
}

export default page

export const dynamic = "force-dynamic"