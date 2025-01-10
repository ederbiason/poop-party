import { Party } from "@/types/party"
import axios from "axios"
import { CircleMinus, CirclePlus, CircleUserRound, Crown, History, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import moment from 'moment'
import { User } from "@/types/user"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import confetti from "canvas-confetti"
import { PartyDropDownMenu } from "./PartyDropdownMenu"

export interface PartyContext {
    party: Party
    fetchParty: () => Promise<void>
    user: User
}

export function PartyDetails() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const navigate = useNavigate()

    const { toast } = useToast()

    const [selectedTab, setSelectedTab] = useState<string>("history")
    const [shitCounter, setShitCounter] = useState<number>(1)

    const { id: partyId } = useParams()
    const { party, fetchParty, user } = useOutletContext<PartyContext>()

    let poopSound = new Audio('/sounds/poop.wav')

    async function handleUpdateIndividualShits(amount: number) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/shits`, { amount }, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            fetchParty()
            setShitCounter(1)
            toast({
                variant: "default",
                title: "Bela cagada, colega! 😉",
                description: "Cagada contabilizada com sucesso",
            })
            poopSound.play()
            confetti()
        } catch (error: any) {
            console.error(error.message)
        }
    }

    const getDayPeriod = (time: Date) => {
        const hour = moment(time).hour()
        if (hour < 12) return "da manhã"
        if (hour < 18) return "da tarde"
        return "da noite"
    }

    return (
        <div className="w-full h-full">
            {party ? (
                (() => {
                    const totalPartyShits = party.members.reduce((total, member) => total + member.individualShits, 0)
                    const totalGoalsCompleted = party.goals.reduce((total, goal) => { return goal.completed ? total + 1 : total }, 0)
                    const totalDaysToFinishParty = Math.round((new Date(party.endDate).getTime() - new Date(party.createdAt).getTime()) / (1000 * 3600 * 24))

                    return (
                        <div className="flex flex-col w-full min-h-screen">
                            <div className="p-6 w-full ">
                                <div className="flex items-center justify-between mb-5">
                                    <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                                        {party.name}
                                    </h1>

                                    <PartyDropDownMenu 
                                        user={user}
                                        fetchParty={fetchParty}
                                        party={party}
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center gap-5 pt-2">
                                    <Carousel className="w-full overflow-hidden py-1 px-2">
                                        <CarouselContent className="gap-5">
                                            {party.members.sort((a, b) => b.individualShits - a.individualShits).map((member, index) => (
                                                <CarouselItem className="basis-1/3 pl-0 flex flex-col gap-1 items-center justify-between capitalize text-center relative" key={member.userId._id}>
                                                    {
                                                        member.userId.profileImage !== "" ? (
                                                            <Avatar className="h-24 w-24 border-2 border-brown-700" onClick={() => navigate(`/profile/${member.userId._id}`)}>
                                                                <AvatarImage src={member.userId.profileImage} alt="Imagem de perfil do membro" className="object-cover" />
                                                            </Avatar>
                                                        ) : (
                                                            <CircleUserRound size={100} />
                                                        )
                                                    }

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
                                            {
                                                party.partyEnded
                                                    ? "Finalizada"
                                                    : (
                                                        <>
                                                            Termina em: <span className="font-extrabold">{totalDaysToFinishParty} {totalDaysToFinishParty > 1 ? "dias" : "dia"}</span>
                                                        </>
                                                    )
                                            }
                                        </p>
                                        <p className="bg-brown-400 px-4 rounded-full py-1 border border-brown-600">
                                            Total: {totalPartyShits} 💩
                                        </p>
                                    </div>

                                    <div className="flex items-start justify-between gap-5">
                                        <div className="flex items-center gap-4 justify-between bg-brown-400 rounded-full px-5 ">
                                            <CircleMinus
                                                onClick={() => setShitCounter((prevCount) => Math.max(prevCount - 1, 1))}
                                            />

                                            <div className="bg-white h-10 w-20 text-center p-2">
                                                {shitCounter}
                                            </div>

                                            <CirclePlus
                                                onClick={() => setShitCounter((prevCount) => prevCount + 1)}
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            className="text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold"
                                            onClick={() => handleUpdateIndividualShits(shitCounter)}
                                            disabled={new Date(party.endDate).getTime() < Date.now()}
                                        >
                                            Contabilizar 💩
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brown-500 w-full rounded-t-2xl pt-6 flex-1 h-full">
                                <Tabs value={selectedTab} className="w-full h-full">
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
                                    <TabsContent value="history" className="w-full h-full p-6">
                                        <div className="flex flex-col gap-3">
                                            {
                                                party.history.length === 0 ? (
                                                    <div className="text-center text-brown-300 font-semibold">
                                                        <p>Não há registros de cagadas ainda.</p>
                                                    </div>
                                                ) : (
                                                    party.history.slice(-10).reverse().map((lastPoop) => (
                                                        <div key={lastPoop._id} className="bg-brown-400 rounded-lg p-3 flex items-center gap-3 relative text-brown-300">
                                                            {
                                                                lastPoop.userId.profileImage !== "" ? (
                                                                    <Avatar className="h-16 w-16 border-2 border-brown-700">
                                                                        <AvatarImage src={lastPoop.userId.profileImage} alt="Imagem de perfil do membro" className="object-cover" />
                                                                    </Avatar>
                                                                ) : (
                                                                    <CircleUserRound size={100} />
                                                                )
                                                            }

                                                            <div className="">
                                                                <p className="capitalize font-semibold text-lg">
                                                                    {lastPoop.userId.name}
                                                                </p>

                                                                <p className="font-semibold text-lg">
                                                                    {`${moment(lastPoop.shitTime).format("DD/MM - HH:mm")} ${getDayPeriod(lastPoop.shitTime)}`}
                                                                </p>
                                                            </div>

                                                            <History className="absolute top-1 right-1" />
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="goals" className="w-full h-full p-6 pt-4">
                                        {
                                            party.goals.length !== 0 && (
                                                <p className="text-brown-300 font-semibold mb-2">
                                                    {totalGoalsCompleted} de {party.goals.length} concluído
                                                </p>
                                            )
                                        }

                                        <div className="bg-brown-400 p-5 rounded-lg flex flex-col gap-5 w-full h-full">
                                            {
                                                party.goals.length === 0 ? (
                                                    <div className="text-center text-brown-300 font-semibold">
                                                        <p>Não há metas de cagadas ainda.</p>
                                                    </div>
                                                ) : (
                                                    party.goals.sort((a, b) => a.targetShits - b.targetShits).map((goal) => (
                                                        <div key={goal._id} className="flex gap-3 items-center justify-between relative">
                                                            <Checkbox
                                                                disabled
                                                                className="w-5 h-5"
                                                                checked={goal.completed}
                                                            />

                                                            <Progress value={((totalPartyShits) / goal.targetShits) * 100} className="h-2" />
                                                            <span
                                                                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-800"
                                                            >
                                                                {Math.min(Number(((totalPartyShits / goal.targetShits) * 100).toFixed()), 100)}%
                                                            </span>

                                                            <p className="font-bold">
                                                                {goal.targetShits}
                                                            </p>
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )
                })()
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