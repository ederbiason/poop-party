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
import { logout } from "@/utils/auth";

export function Header() {
    const navigate = useNavigate()

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
                    <DropdownMenuItem>
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
        </div>
    )
}
