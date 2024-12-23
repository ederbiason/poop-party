import { User } from "@/types/user"
import axios from "axios"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export function Profile() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')
    const { id: userId } = useParams()

    const [user, setUser] = useState<User>()

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(`${BACKEND_DOMAIN}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                })
                setUser(response.data)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchUser()
    }, [])

    if (!user) {
        return (
            <div className="w-full h-full flex mt-10 justify-center gap-2 bg-brown-300">
                <Loader className="animate-spin" />
                Carregando perfil do usuário
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen overflow-hidden">
            <div className="w-full flex flex-col items-center z-10 relative pt-10">
                <div 
                    className="w-[570px] h-[500px] bg-brown-500 absolute rounded-full -top-80"
                />
                
                <img 
                    className="w-52 rounded-full h-52 z-10 border-4 border-brown-800"
                    src="https://i.pinimg.com/736x/e7/e4/61/e7e461aa16f9529c951f4f1656a4cfbf.jpg"
                    alt="Foto de perfil do usuário" 
                />
                
                <h1 className="mt-2 font-bold text-2xl capitalize">
                    {user?.name}
                </h1>
            </div>
        </div>
    )
}