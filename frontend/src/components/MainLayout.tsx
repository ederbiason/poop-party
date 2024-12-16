import { Header } from "@/components/Header"
import { Outlet } from "react-router-dom"

export function MainLayout() {
    return (
        <div className="w-full h-full bg-brown-300">
            <Header />

            <main className="h-full w-full">
                <Outlet />
            </main>
        </div>
    )
}