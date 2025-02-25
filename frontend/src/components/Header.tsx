import { CircleUserRound, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { logout } from "@/utils/auth";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import axios from "axios";
import { Button } from "@/components/ui/button";

export function Header() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const [user, setUser] = useState<User>()
    const [unauthorizedModal, setUnauthorizedModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(`${BACKEND_DOMAIN}/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                })
                setUser(response.data)
            } catch (error: any) {
                console.error(error.message)
                setUnauthorizedModal(true)
            }
        }

        fetchUser()
    }, [])

    return (
        <div className="w-full h-14 bg-brown-600 flex items-center px-5 justify-between">
            <p className="text-3xl cursor-pointer" onClick={() => navigate("/")}>
                💩
            </p>

            <p className="text-brown-300 font-extrabold uppercase text-2xl">
                Poop Party
            </p>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Menu color="#F8F4E1" size={36} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-brown-400 font-semibold">
                    <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => navigate(`/profile/${user?._id}`)}
                    >
                        <CircleUserRound />
                        Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => logout()}
                    >
                        <LogOut />
                        Sair da conta
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={unauthorizedModal} onOpenChange={setUnauthorizedModal}>
                <DialogContent className="bg-brown-100 rounded-lg">
                    <DialogHeader className="text-start">
                        <DialogTitle className="text-brown-700 text-2xl">🚫 Acesso negado 🚫</DialogTitle>
                        <DialogDescription className="text-brown-500">
                            Seu token de autenticação está inválido ou expierou!
                        </DialogDescription>
                    </DialogHeader>

                    <p className="text-brown-700 font-semibold">
                        Faça login novamente para ter acesso ao site.
                    </p>

                    <Button
                        type="submit"
                        onClick={() => {
                            localStorage.removeItem('token')
                            window.location.reload()
                        }}
                        className="bg-brown-800 hover:bg-brown-500 mt-2"
                    >
                        Fazer Login
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
