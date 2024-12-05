import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

            <Menu color="#F8F4E1" size={36} />
        </div>
    )
}
