import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Party } from "@/types/party"
import { User } from "@/types/user"
import { EllipsisVertical, Goal, LogOut, Trash2, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface PartyDropDownMenuProps {
    party: Party
    user: User
    partyId: string
    fetchParty: VoidFunction
}

export function PartyDropDownMenu({ party, user, partyId, fetchParty }: PartyDropDownMenuProps) {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isLeaveGroupDialogOpen, setIsLeaveGroupDialogOpen] = useState(false)

    const navigate = useNavigate()
    const { toast } = useToast()

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="text-brown-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-brown-400 font-semibold">
                <DropdownMenuLabel>Grupo</DropdownMenuLabel>
                <DropdownMenuSeparator className="" />
                {
                    party.createdBy === user!._id && new Date(party.endDate).getTime() >= Date.now() ? (
                        <>
                            <DropdownMenuItem onClick={() => navigate('members')}>
                                <Users />
                                Membros
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => navigate('goals')}>
                                <Goal />
                                Metas
                            </DropdownMenuItem>

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
                        </>
                    ) : party.createdBy === user!._id && new Date(party.endDate).getTime() < Date.now() ? (
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
    )
}