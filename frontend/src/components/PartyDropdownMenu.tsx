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
import { EllipsisVertical, Goal, LogOut, SquarePen, Trash2, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PartyDropDownMenuProps {
    party: Party
    user: User
    fetchParty: VoidFunction
}

export function PartyDropDownMenu({ party, user, fetchParty }: PartyDropDownMenuProps) {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [isLeaveGroupDialogOpen, setIsLeaveGroupDialogOpen] = useState<boolean>(false)
    const [isRenamingGroupDialogOpen, setIsRenamingGroupDialogOpen] = useState<boolean>(false)
    const [newPartyName, setNewPartyName] = useState<string>(party.name)

    const navigate = useNavigate()
    const { toast } = useToast()

    async function handleDeleteGroup() {
        try {
            await axios.delete(`${BACKEND_DOMAIN}/parties/${party._id}`, {
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
            await axios.patch(`${BACKEND_DOMAIN}/parties/${party._id}/leave`, {}, {
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

    async function handleRenameGroup() {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${party._id}/rename`, { newPartyName: newPartyName }, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            fetchParty()
            setIsRenamingGroupDialogOpen(false)
            toast({
                variant: "default",
                title: "Sucesso",
                description: "Grupo renomeado com sucesso!",
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
                                <Dialog open={isRenamingGroupDialogOpen} onOpenChange={setIsRenamingGroupDialogOpen}>
                                    <DialogTrigger
                                        className="flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setIsRenamingGroupDialogOpen(true)
                                        }}
                                    >
                                        <SquarePen />
                                        Renomear grupo
                                    </DialogTrigger>
                                    <DialogContent className="bg-brown-100 rounded-lg" onClick={(e) => e.stopPropagation()} >
                                        <DialogHeader className="text-start">
                                            <DialogTitle className="text-brown-700 text-2xl">
                                                Renomear grupo
                                            </DialogTitle>
                                            <DialogDescription className="text-brown-500">
                                                Preencha o campo abaixo e altere o nome do grupo!
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex flex-col gap-3">
                                            <p className="italic mb-1">
                                                Você está editando o grupo: <span className="capitalize font-semibold">{party.name}</span>
                                            </p>
                                            <Label>
                                                Nome do grupo
                                            </Label>
                                            <Input
                                                defaultValue={party.name}
                                                type="text"
                                                placeholder="Insira o novo nome do grupo"
                                                className="bg-brown-300 border-brown-600"
                                                onChange={(e) => setNewPartyName(e.target.value)}
                                            />
                                        </div>

                                        <DialogFooter className="flex flex-row items-center justify-end gap-5">
                                            <Button
                                                type="button"
                                                className="text-brown-300 bg-red-800 hover:bg-red-500 font-semibold"
                                                onClick={() => setIsRenamingGroupDialogOpen(false)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="button"
                                                className="text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold"
                                                onClick={() => handleRenameGroup()}
                                            >
                                                Continuar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
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
                                    <DialogContent className="bg-brown-100 rounded-lg" onClick={(e) => e.stopPropagation()} >
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