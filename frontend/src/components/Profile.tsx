import { User } from "@/types/user"
import { Loader, PencilLine } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"

export interface ProfileContext {
    user: User
    maxIndividualShits: number
}

export function Profile() {
    const {user, maxIndividualShits} = useOutletContext<ProfileContext>()

    const navigate = useNavigate()

    if (!user) {
        return (
            <div className="w-full h-full flex mt-10 justify-center gap-2 bg-brown-300 min-h-screen">
                <Loader className="animate-spin" />
                Carregando perfil do usuário
            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-hidden">
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

                <div className="absolute z-20 top-10 right-28 bg-blue-300 rounded-full p-2 border border-blue-900 hover:border-blue-200 cursor-pointer">
                    <PencilLine 
                        size={28} 
                        fill="#bfdbfe" 
                        strokeWidth={2} 
                        onClick={() => navigate("edit")} 
                    />
                </div>
            </div>

            <div className="w-full flex items-center justify-evenly text-center mt-6">
                <div>
                    <p className="font-bold text-2xl">{user.parties.length}</p>
                    <p className="text-brown-600">Parties</p>
                </div>

                <div>
                    <p className="font-bold text-2xl">{maxIndividualShits}</p>
                    <p className="text-brown-600">Cagadas</p>
                </div>

                <div>
                    <p className="font-bold text-2xl">0</p>
                    <p className="text-brown-600">Vitórias</p>
                </div>
            </div>
        </div>
    )
}