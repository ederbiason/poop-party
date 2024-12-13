import { Party } from "@/types/party";
import { User } from "@/types/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

export function PartyWrapper() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')
    const { id: partyId } = useParams()

    const [user, setUser] = useState<User>()
    const [party, setParty] = useState<Party>()

    async function fetchParty() {
        try {
            const response = await axios.get(`${BACKEND_DOMAIN}/parties/${partyId}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })
            setParty(response.data)
        } catch (error: any) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        if (partyId) {
            fetchParty()
        }
    }, [partyId])

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
            }
        }

        fetchUser()
    }, [])

    return (
        <div className="w-full h-full">
            <Outlet context={{party, fetchParty, user}} />
        </div>
    )
}
