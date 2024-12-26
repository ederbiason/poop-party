import { CircleUserRound, Frown } from "lucide-react"
import { CreatePartyForm } from "@/components/CreatePartyForm"
import axios from "axios"
import { useEffect, useState } from "react"
import { User } from "@/types/user"
import { Party } from "@/types/party"
import { useNavigate } from "react-router-dom"

import moment from "moment"
import 'moment/dist/locale/pt-br'
moment.locale('pt-br')

export function Home() {
    const [user, setUser] = useState<User>()
    const [parties, setParties] = useState<Party[]>([])

    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

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
            }
        }

        fetchUser()
    }, [])

    async function fetchParties() {
        try {
            const response = await axios.get(`${BACKEND_DOMAIN}/parties/user/${user!._id}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            if (response.data.length === 0) setParties([])

            setParties(response.data)
        } catch (error: any) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchParties()
        }
    }, [user])

    return (
        <div className="p-6 px-8">
            <div className="flex items-center justify-between">
                <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                    Suas parties
                </h1>

                <CreatePartyForm fetchParties={fetchParties} />
            </div>

            {
                parties.length > 0 ? (
                    <div className="py-5 mt-3 flex flex-col gap-6">
                        {parties.map((party) => (
                            <div key={party._id} className="rounded-3xl bg-brown-500 cursor-pointer" onClick={() => navigate(`/party/${party._id}`)}>
                                <p className="text-center p-3 text-white text-2xl font-bold">
                                    {party.name}
                                </p>

                                <div className="bg-brown-200 px-3 flex flex-col divide-y divide-brown-500">
                                    {party.members.sort((a, b) => b.individualShits - a.individualShits).map((member, index) => {
                                        const lastPoopLog = party.history
                                            .filter((log: any) => log.userId === member.userId._id)
                                            .sort((a, b) => new Date(b.shitTime).getTime() - new Date(a.shitTime).getTime())[0]

                                        const timePassed = lastPoopLog
                                            ? moment(lastPoopLog.shitTime).fromNow()
                                            : "Sem registro"

                                        return (
                                            <div key={member.userId._id} className="flex items-center justify-between py-2">
                                                <div className="flex justify-between items-center gap-2">
                                                    <CircleUserRound size={55} />
                                                    <div className="font-semibold">
                                                        <p className="capitalize">{member.userId.name}</p>
                                                        <p>💩: {member.individualShits}</p>
                                                    </div>
                                                </div>

                                                <div className="font-semibold text-end">
                                                    <p>{index + 1}°</p>
                                                    <p>
                                                        {timePassed}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <p className="text-center p-3 text-white text-2xl font-bold">
                                    Total: {party.members.reduce((total, member) => total + member.individualShits, 0)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-5 mt-3 flex gap-2 font-semibold justify-center text-brown-700 min-h-screen">
                        <p>Você não faz parte de nenhuma party!</p>
                        <Frown />
                    </div>
                )
            }
        </div>
    )
}