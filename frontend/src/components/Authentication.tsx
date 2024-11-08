import { Login } from "@/components/Login"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PoopLogo from "@/assets/poop.png"
import { SignUp } from "@/components/SignUp"
import { useState } from "react"

export default function Authentication() {
    const [selectedTab, setSelectedTab] = useState('login')

    function handleSignUpSuccess() {
        setSelectedTab('login')
    }

    return (
        <div className="w-full h-screen bg-brown-500 flex flex-col items-center justify-center relative">
            <div className="absolute -top-28 bg-brown-800 blur-2xl rounded-full w-full h-[400px]" />
            <img
                src={PoopLogo}
                alt="Foto de um poop usando óculos segurando um contador na mão"
                className="relative z-10"
            />

            <Tabs value={selectedTab} className="w-full h-full bg-brown-300 rounded-t-[100px] overflow-hidden z-10">
                <TabsList className="w-full flex justify-around bg-brown-300 text-brown-700 mt-7">
                    <TabsTrigger value="login" onClick={() => setSelectedTab('login')} className="">Login</TabsTrigger>
                    <TabsTrigger value="signup" onClick={() => setSelectedTab('signup')} className="">Cadastro</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="w-full h-full p-10">
                    <Login />
                </TabsContent>
                <TabsContent value="signup" className="w-full h-full p-10">
                    <SignUp onSignUpSuccess={handleSignUpSuccess} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
