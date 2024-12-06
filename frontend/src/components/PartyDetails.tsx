import { Party } from "@/types/party"
import axios from "axios"
import { CircleMinus, CirclePlus, CircleUserRound, Crown, EllipsisVertical, History, LoaderCircle, LogOut, SquarePlus, Trash2 } from "lucide-react"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import moment from 'moment'
import { User } from "@/types/user"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useToast } from "@/hooks/use-toast"

export function PartyDetails() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const { toast } = useToast()

    const [party, setParty] = useState<Party>()
    const [user, setUser] = useState<User>()
    const [targetGoalShit, setTargetGoalShit] = useState<number>(0)
    const [selectedTab, setSelectedTab] = useState<string>("history")
    const [shitCounter, setShitCounter] = useState<number>(1)

    const { id: partyId } = useParams()

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

    async function handleGoalSubmit(targetShits: number) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/goals`, { targetShits }, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            fetchParty()
        } catch (error: any) {
            console.error(error.message)
        }
    }

    async function handleUpdateIndividualShits(amount: number) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/shits`, { amount }, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            fetchParty()
            setShitCounter(0)
            toast({
                variant: "default",
                title: "Bela cagada, colega! 😉",
                description: "Cagada contabilizada com sucesso",
            })
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

                    return (
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
                                    <div className="flex items-start justify-between gap-5">
                                        <div className="flex items-center gap-4 justify-between bg-brown-400 rounded-full px-5 mb-2">
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
                                        >
                                            Contabilizar 💩
                                        </Button>
                                    </div>

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
                                            Total: {totalPartyShits} 💩
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
                                        {party.history.slice(-10).reverse().map((lastPoop) => (
                                            <div key={lastPoop._id} className="bg-brown-400 rounded-lg p-3 flex items-center gap-3 relative text-brown-300">
                                                <CircleUserRound size={60} />

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
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="goals" className="w-full h-full px-6 flex flex-col gap-5 items-end mb-6">
                                        {
                                            party.createdBy === user!._id && (
                                                <Dialog>
                                                    <DialogTrigger className="w-fit items-center text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold text-base flex p-2 px-3 rounded-md gap-2">
                                                        <SquarePlus />
                                                        Criar meta
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-brown-100 rounded-lg">
                                                        <DialogHeader className="text-start">
                                                            <DialogTitle className="text-brown-700 text-2xl">Crie uma meta 🎯</DialogTitle>
                                                            <DialogDescription className="text-brown-500">
                                                                Preencha o campo abaixo e crie sua meta!
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="flex flex-col gap-3">
                                                            <Label>Número alvo de cagadas</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="Digite o número de cagadas alvo"
                                                                className="bg-brown-300 border-brown-600"
                                                                min={1}
                                                                onChange={(e) => Number(e.target.value) > 1 && setTargetGoalShit(Number(e.target.value))}
                                                            />
                                                        </div>

                                                        <Button
                                                            type="submit"
                                                            onClick={() => handleGoalSubmit(targetGoalShit)}
                                                            className="bg-brown-800 hover:bg-brown-500 mt-2"
                                                        >
                                                            Criar Meta
                                                        </Button>
                                                    </DialogContent>
                                                </Dialog>
                                            )
                                        }

                                        <div className="bg-brown-400 p-5 rounded-lg flex flex-col gap-5 w-full">
                                            {party.goals.sort((a, b) => a.targetShits - b.targetShits).map((goal) => (
                                                <div key={goal._id} className="flex gap-3 items-center justify-between">
                                                    <Checkbox
                                                        disabled
                                                        className="w-5 h-5"
                                                        checked={goal.targetShits <= totalPartyShits}
                                                    />

                                                    <Progress value={((totalPartyShits) / goal.targetShits) * 100} className="h-2" />

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