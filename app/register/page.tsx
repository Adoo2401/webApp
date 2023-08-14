import { redirect } from "next/navigation";
import RegisterComponent from "./RegisterComponent"
import {getServerSession} from 'next-auth/next'
import Navbar from "@/components/Navbar";

const page = async () => {

  const session = await getServerSession();
  if(session){return redirect("/dashboard")}

  return (
    <>
     <Navbar isHome={false}/>
     <RegisterComponent/>
    </>
  )
}

export default page