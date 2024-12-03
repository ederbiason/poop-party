import { Menu } from "lucide-react";

export function Header() {
    return (
        <div className="w-full h-14 bg-brown-600 flex items-center px-5 justify-between">
            <p className="text-3xl">
                💩
            </p>

            <p className="text-brown-300 font-extrabold uppercase text-2xl">
                Poop Party
            </p>

            <Menu color="#F8F4E1" size={36} />
        </div>
    )
}
