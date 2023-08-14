import { redirect } from 'next/navigation'
import {getServerSession} from 'next-auth/next'
import Login from '@/components/Login';
import Navbar from '@/components/Navbar'

const LoginPage = async () => {

    const session = await getServerSession()
    if(session){redirect("/dashboard")}

    return (
        <>
        <Navbar isHome={false}/>
        <Login/>
        </>
    ) 
};

export default LoginPage;
