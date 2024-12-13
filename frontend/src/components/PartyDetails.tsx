import { Party } from "@/types/party"
import axios from "axios"
import { CircleMinus, CirclePlus, CircleUserRound, Crown, EllipsisVertical, History, LoaderCircle, LogOut, SquarePlus, Trash2, Users } from "lucide-react"
import { useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
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
    DialogFooter,
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

    const [targetGoalShit, setTargetGoalShit] = useState<number>(0)
    const [selectedTab, setSelectedTab] = useState<string>("history")
    const [shitCounter, setShitCounter] = useState<number>(1)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isLeaveGroupDialogOpen, setIsLeaveGroupDialogOpen] = useState(false)
    const [isCreateGoalDialogOpen, setIsCreateGoalDialogOpen] = useState(false)

    const { id: partyId } = useParams()
    const { party, fetchParty, user } = useOutletContext<PartyContext>()

    async function handleGoalSubmit(targetShits: number) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/goals`, { targetShits }, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            fetchParty()
            setIsCreateGoalDialogOpen(false)
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
            setShitCounter(1)
            toast({
                variant: "default",
                title: "Bela cagada, colega! 😉",
                description: "Cagada contabilizada com sucesso",
            })
        } catch (error: any) {
            console.error(error.message)
        }
    }

    async function handleDeleteGroup() {
        try {
            await axios.delete(`${BACKEND_DOMAIN}/parties/${partyId}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            setIsDeleteDialogOpen(false)
            navigate("/")
            fetchParty()
            toast({
                variant: "default",
                title: "Sucesso",
                description: "Você apagou o grupo!",
            })
        } catch (error: any) {
            console.error(error.message)
        }
    }

    async function handleLeaveGroup() {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/leave`, {}, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            setIsLeaveGroupDialogOpen(false)
            navigate("/")
            fetchParty()
            toast({
                variant: "default",
                title: "Sucesso",
                description: "Você saiu do grupo!",
            })
        } catch (error: any) {
            console.error(error)
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
                                        <DropdownMenuContent className="bg-brown-400 font-semibold">
                                            <DropdownMenuLabel>Grupo</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="" />
                                            {
                                                party.createdBy === user!._id ? (
                                                    <>
                                                        <DropdownMenuItem>
                                                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                                <DialogTrigger
                                                                    className="flex items-center gap-2"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setIsDeleteDialogOpen(true)
                                                                    }}
                                                                >
                                                                    <Trash2 />
                                                                    Deletar grupo
                                                                </DialogTrigger>
                                                                <DialogContent className="bg-brown-100 rounded-lg">
                                                                    <DialogHeader className="text-start">
                                                                        <DialogTitle className="text-brown-700 text-2xl">Tem certeza que deseja deletar o grupo?</DialogTitle>
                                                                        <DialogDescription className="text-brown-500">
                                                                            Essa ação não pode ser desfeita. Isso vai permanentemente deletar o grupo.
                                                                        </DialogDescription>
                                                                    </DialogHeader>

                                                                    <DialogFooter className="flex flex-row items-center justify-end gap-5">
                                                                        <Button
                                                                            type="button"
                                                                            className="text-brown-300 bg-red-800 hover:bg-red-500 font-semibold"
                                                                            onClick={() => setIsDeleteDialogOpen(false)}
                                                                        >
                                                                            Cancelar
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            className="text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold"
                                                                            onClick={() => handleDeleteGroup()}
                                                                        >
                                                                            Continuar
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => navigate('members')}>
                                                            <Users />
                                                            Membros
                                                        </DropdownMenuItem>
                                                    </>
                                                ) : (
                                                    <DropdownMenuItem>
                                                        <Dialog open={isLeaveGroupDialogOpen} onOpenChange={setIsLeaveGroupDialogOpen}>
                                                            <DialogTrigger
                                                                className="flex items-center gap-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setIsLeaveGroupDialogOpen(true)
                                                                }}
                                                            >
                                                                <LogOut />
                                                                Sair do grupo
                                                            </DialogTrigger>
                                                            <DialogContent className="bg-brown-100 rounded-lg">
                                                                <DialogHeader className="text-start">
                                                                    <DialogTitle className="text-brown-700 text-2xl">Tem certeza que deseja sair do grupo?</DialogTitle>
                                                                    <DialogDescription className="text-brown-500">
                                                                        Essa ação não pode ser desfeita. Você será removido do grupo.
                                                                    </DialogDescription>
                                                                </DialogHeader>

                                                                <DialogFooter className="flex flex-row items-center justify-end gap-5">
                                                                    <Button
                                                                        type="button"
                                                                        className="text-brown-300 bg-red-800 hover:bg-red-500 font-semibold"
                                                                        onClick={() => setIsLeaveGroupDialogOpen(false)}
                                                                    >
                                                                        Cancelar
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        className="text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold"
                                                                        onClick={() => handleLeaveGroup()}
                                                                    >
                                                                        Continuar
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </DropdownMenuItem>
                                                )
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-5 pt-2">
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
                                        >
                                            Contabilizar 💩
                                        </Button>
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
                                        {
                                            party.history.length === 0 ? (
                                                <div className="text-center text-brown-300 font-semibold">
                                                    <p>Não há registros de cagadas ainda.</p>
                                                </div>
                                            ) : (
                                                party.history.slice(-10).reverse().map((lastPoop) => (
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
                                                ))
                                            )
                                        }
                                    </TabsContent>

                                    <TabsContent value="goals" className="w-full h-full px-6 flex flex-col gap-5 items-end mb-6">
                                        {
                                            party.createdBy === user!._id && (
                                                <Dialog open={isCreateGoalDialogOpen} onOpenChange={setIsCreateGoalDialogOpen}>
                                                    <DialogTrigger
                                                        className="w-fit items-center text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold text-base flex p-2 px-3 rounded-md gap-2"
                                                        onClick={() => setIsCreateGoalDialogOpen(true)}
                                                    >
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
                                                                checked={goal.targetShits <= totalPartyShits}
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