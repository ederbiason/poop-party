import { CircleUserRound } from "lucide-react"
import { CreatePartyForm } from "@/components/CreatePartyForm"
import axios from "axios"
import { useEffect, useState } from "react"
import { User } from "@/types/user"
import { Party } from "@/types/party"

{/*
const parties = [
    {
        _id: "6729880e18f9c8e826a22968",
        name: "Os três mosqueteiros",
        createdBy: "671a99572963079125276a91",
        members: [
            { userId: "671a96993e93a40a8f6c6cf4", individualShits: 0 },
            { userId: "671a636591ab9df9fb474cd9", individualShits: 0 },
            { userId: "672cc6337800bb8672862bcd", individualShits: 0 },
            { userId: "672cd1f22698ed2c87797991", individualShits: 0 },
            { userId: "671a99572963079125276a91", individualShits: 4 }
        ],
        endDate: "2024-12-31T23:59:59.000Z",
        goals: [
            { targetShits: 100, completed: false },
            { targetShits: 200, completed: false },
            { targetShits: 300, completed: false }
        ],
        history: [
            { userId: "671a99572963079125276a91", shitTime: "2024-11-07T18:33:30.772Z" }
        ],
        createdAt: "2024-11-05T02:50:54.543Z",
        updatedAt: "2024-11-07T18:33:30.778Z"
    },
    {
        _id: "6729a20f23f7b9e839a33476",
        name: "The Power Poopers",
        createdBy: "671a96993e93a40a8f6c6cf4",
        members: [
            { userId: "671a99572963079125276a91", individualShits: 3 },
            { userId: "671a636591ab9df9fb474cd9", individualShits: 5 },
            { userId: "672cc6337800bb8672862bcd", individualShits: 2 }
        ],
        endDate: "2025-01-15T23:59:59.000Z",
        goals: [
            { targetShits: 50, completed: false },
            { targetShits: 150, completed: false },
            { targetShits: 250, completed: false }
        ],
        history: [
            { userId: "671a99572963079125276a91", shitTime: "2024-11-06T17:45:20.772Z" },
            { userId: "671a636591ab9df9fb474cd9", shitTime: "2024-11-07T10:25:30.772Z" }
        ],
        createdAt: "2024-11-06T14:20:54.543Z",
        updatedAt: "2024-11-07T11:30:30.778Z"
    },
    {
        _id: "6729c33a57e8f7c842a54678",
        name: "Flush Brothers",
        createdBy: "672cc6337800bb8672862bcd",
        members: [
            { userId: "672cc6337800bb8672862bcd", individualShits: 7 },
            { userId: "671a99572963079125276a91", individualShits: 4 },
            { userId: "671a96993e93a40a8f6c6cf4", individualShits: 1 }
        ],
        endDate: "2025-02-28T23:59:59.000Z",
        goals: [
            { targetShits: 100, completed: true },
            { targetShits: 200, completed: false },
            { targetShits: 300, completed: false }
        ],
        history: [
            { userId: "672cc6337800bb8672862bcd", shitTime: "2024-11-08T18:33:30.772Z" },
            { userId: "671a99572963079125276a91", shitTime: "2024-11-07T12:22:30.772Z" }
        ],
        createdAt: "2024-11-08T09:10:54.543Z",
        updatedAt: "2024-11-08T18:33:30.778Z"
    }
]
*/}

export function Home() {
    const [user, setUser] = useState<User>()
    const [parties, setParties] = useState<Party[]>([])

    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

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

    useEffect(() => {
        if (user) {
            async function fetchParties() {
                try {
                    const response = await axios.get(`${BACKEND_DOMAIN}/parties/user/${user!._id}`, {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                        },
                    })
                    setParties(response.data)
                    console.log(response.data)
                } catch (error: any) {
                    console.error(error.message)
                }
            }

            fetchParties()
        }
    }, [user])

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                    Suas parties
                </h1>

                <CreatePartyForm />
            </div>

            <div className="py-5 mt-3 flex flex-col gap-6">
                {parties.map((party) => (
                    <div key={party._id} className="rounded-3xl bg-brown-500">
                        <p className="text-center p-3 text-white text-2xl font-bold">
                            {party.name}
                        </p>

                        <div className="bg-brown-200 px-3 flex flex-col divide-y divide-brown-500">
                            {party.members.sort((a, b) => b.individualShits - a.individualShits).map((member, index) => (
                                <div key={member.userId._id} className="flex items-center justify-between py-2">
                                    <div className="flex justify-between items-center gap-2">
                                        <CircleUserRound size={55} />
                                        <div className="font-semibold">
                                            <p className="capitalize">{member.userId.name}</p>
                                            <p>💩: {member.individualShits}</p>
                                        </div>
                                    </div>

                                    <div className="font-semibold">
                                        <p className="text-end">{index + 1}°</p>
                                        <p>2 hrs atrás</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-center p-3 text-white text-2xl font-bold">
                            Total: {party.members.reduce((total, member) => total + member.individualShits, 0)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}