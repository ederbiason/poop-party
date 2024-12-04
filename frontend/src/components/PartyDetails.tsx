import { Party } from "@/types/party"
import axios from "axios"
import { CircleUserRound, Crown, EllipsisVertical, History, LoaderCircle, LogOut, SquarePlus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import moment from 'moment'
import { User } from "@/types/user"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function PartyDetails() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const [party, setParty] = useState<Party>()
    const [user, setUser] = useState<User>()
    const [selectedTab, setSelectedTab] = useState<string>("history")

    const { id: partyId } = useParams()

    useEffect(() => {
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

        fetchParty()
    }, [])

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

    const getDayPeriod = (time: Date) => {
        const hour = moment(time).hour()
        if (hour < 12) return "da manhã"
        if (hour < 18) return "da tarde"
        return "da noite"
    }

    return (
        <div className="w-full h-full">
            {party ? (
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                                {party.name}
                            </h1>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <EllipsisVertical className="text-brown-700" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-brown-400">
                                    <DropdownMenuLabel>Grupo</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="" />
                                    <DropdownMenuItem>
                                        <LogOut />
                                        Sair do grupo
                                    </DropdownMenuItem>
                                    {
                                        party.createdBy === user!._id && (
                                            <DropdownMenuItem>
                                                <Trash2 />
                                                Deletar grupo
                                            </DropdownMenuItem>
                                        )
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-5">
                            <Carousel className="w-full overflow-hidden">
                                <CarouselContent className="gap-5">
                                    {party.members.sort((a, b) => b.individualShits - a.individualShits).map((member, index) => (
                                        <CarouselItem className=" basis-1/3 flex flex-col gap-1 items-center justify-between capitalize text-center relative" key={member.userId._id}>
                                            <CircleUserRound size={100} />

                                            <p className="font-semibold flex items-center justify-center gap-1">
                                                {index === 0 && member.individualShits > 0 && (
                                                    <Crown className="" size={24} fill="yellow" stroke="black" />
                                                )}
                                                {member.userId.name}
                                            </p>
                                            <p className="px-4 bg-brown-400 rounded-full font-semibold border border-brown-600">
                                                {member.individualShits} 💩
                                            </p>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                            <div className="flex items-center justify-between w-full text-brown-300 font-semibold">
                                <p className="bg-brown-400 px-4 rounded-full py-1 border border-brown-600">
                                    Criado em: {moment(party.createdAt).format("DD/MM/YYYY")}
                                </p>
                                <p className="bg-brown-400 px-4 rounded-full py-1 border border-brown-600">
                                    Total: {party.members.reduce((total, member) => total + member.individualShits, 0)} 💩
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brown-500 w-full h-full rounded-t-2xl pt-6">
                        <Tabs value={selectedTab} className="w-full">
                            <TabsList className="w-full flex justify-around text-brown-300">
                                <TabsTrigger
                                    value="history"
                                    onClick={() => setSelectedTab('history')}
                                    className="font-bold data-[state=active]:text-2xl data-[state=active]:text-brown-300 data-[state=active]:border-brown-300 data-[state=active]:border-b-4 data-[state=inactive]:text-brown-100 data-[state=inactive]:border-brown-100"
                                >
                                    Histórico
                                </TabsTrigger>
                                <TabsTrigger
                                    value="goals"
                                    onClick={() => setSelectedTab('goals')}
                                    className="font-bold data-[state=active]:text-2xl data-[state=active]:text-brown-300 data-[state=active]:border-brown-300 data-[state=active]:border-b-4 data-[state=inactive]:text-brown-100 data-[state=inactive]:border-brown-100"
                                >
                                    Metas
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="history" className="w-full h-full px-6 pt-6 flex flex-col gap-3">
                                {party.history.map((lastPoop) => (
                                    <div key={lastPoop._id} className="bg-brown-400 rounded-lg p-3 flex items-center gap-3 relative text-brown-300">
                                        <CircleUserRound size={60} />

                                        <div className="">
                                            <p className="capitalize font-semibold text-lg">
                                                {lastPoop.userId.name}
                                            </p>

                                            <p className="font-semibold text-lg">
                                                {`${moment(lastPoop.shitTime).format("HH:mm")} ${getDayPeriod(lastPoop.shitTime)}`}
                                            </p>
                                        </div>

                                        <History className="absolute top-1 right-1" />
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="goals" className="w-full h-full px-6 flex flex-col gap-5 items-end">
                                {
                                    party.createdBy === user!._id && (
                                        <Button className="w-fit bg-brown-800 hover:bg-brown-500 font-semibold text-base">
                                            <SquarePlus />
                                            Criar meta
                                        </Button>
                                    )
                                }

                                <div className="bg-brown-400 p-5 rounded-lg flex flex-col gap-5 w-full">
                                    {party.goals.sort((a, b) => a.targetShits - b.targetShits).map((goal) => (
                                        <div key={goal._id} className="flex gap-3 items-center justify-between">
                                            <Checkbox disabled className="disabled:border-black disabled:border-2 w-5 h-5" />

                                            <Progress value={((party.members.reduce((total, member) => total + member.individualShits, 0)) / goal.targetShits) * 100} className="h-2" />

                                            <p className="font-bold">
                                                {goal.targetShits}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 mt-10">
                    <LoaderCircle size={50} className="animate-spin" />
                    <p>
                        Carregando informações da Party...
                    </p>
                </div>
            )}
        </div>
    )
}