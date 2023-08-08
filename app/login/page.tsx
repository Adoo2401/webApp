import { redirect } from 'next/navigation'
import {getServerSession} from 'next-auth/next'
import Login from '@/components/Login';

const LoginPage = async () => {

    const session = await getServerSession()
    if(session){redirect("/dashboard")}

    return <Login/>
};

export default LoginPage;
