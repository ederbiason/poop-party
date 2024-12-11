import { Outlet } from "react-router-dom";

export function PartyWrapper() {
    return (
        <div className="w-full h-full">
            <Outlet />
        </div>
    )
}
