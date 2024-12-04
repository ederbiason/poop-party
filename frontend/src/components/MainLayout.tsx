import { Header } from "@/components/Header"
import { Outlet } from "react-router-dom"

export function MainLayout() {
    return (
        <div className="w-full h-screen bg-brown-300">
            <Header />

            <main className="h-full">
                <Outlet />
            </main>
        </div>
    )
}