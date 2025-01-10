import { Outlet } from "react-router-dom";
import { Party } from "@/types/party"
import { User } from "@/types/user"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export interface LoggedUserProps {
    _id: string
    email: string
}

export function ProfileWrapper() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')
    const { id: userId } = useParams()

    const [user, setUser] = useState<User>()
    const [loggedUser, setLoggedUser] = useState<LoggedUserProps>()
    const [maxIndividualShits, setMaxIndividualShits] = useState<number>(0)

    useEffect(() => {
        async function fetchLoggedUser() {
            try {
                const response = await axios.get(`${BACKEND_DOMAIN}/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                })
                setLoggedUser(response.data)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchLoggedUser()
    }, [])

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
    }, [loggedUser])

    useEffect(() => {
        async function fetchUserPartyDetails() {
            try {
                const response = await axios.get(`${BACKEND_DOMAIN}/parties/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                })

                const parties: Party[] = response.data

                const maxShits = parties.reduce((max, party) => {
                    const userShits = party.members.find(member => member.userId._id === userId)?.individualShits || 0
                    return Math.max(max, userShits)
                }, 0)

                setMaxIndividualShits(maxShits)
            } catch (error: any) {
                console.error(error)
            }
        }

        fetchUserPartyDetails()
    }, [userId])

    return (
        <div className="min-h-screen">
            <Outlet context={{user, maxIndividualShits, loggedUser}} />
        </div>
    )
}