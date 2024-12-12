import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User } from "@/types/user"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Member {
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    individualShits: number;
}

interface AddMemberFormProps {
    members: Member[]
    partyId: string
}

export function AddMemberForm({ members, partyId }: AddMemberFormProps) {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const { toast } = useToast()

    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
    const [newMemberEmail, setNewMemberEmail] = useState<string>("")

    const checkMemberAlreadyInParty = async (email: string) => {
        try {
            const response = await axios.get(`${BACKEND_DOMAIN}/users/email/${email}`)
            const user: User = response.data
            const userId = user._id

            const alreadyExists = members.some(member => member.userId._id === userId)

            if (alreadyExists) {
                toast({
                    variant: "destructive",
                    title: "O usuário já esta na lista de membros",
                    description: "Tente adicionar outro membro",
                })
                console.warn("Este usuário já está na lista de membros.")
                return true
            }

            return false
        } catch (error: any) {
            console.error("Não foi possível adicionar o membro" + error.message)
        }
    }

    async function handleAddMemberSubmit(memberEmail: string) {
        try {
            const isMemberAlreadyInParty = await checkMemberAlreadyInParty(memberEmail)

            console.log(isMemberAlreadyInParty)
            if (!isMemberAlreadyInParty) {
                await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/members`, { email: memberEmail }, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                })

                setNewMemberEmail("")
                setIsAddMemberDialogOpen(false)

                toast({
                    variant: "default",
                    title: "Sucesso",
                    description: "Membro adicionado com sucesso 😉",
                })
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
            <DialogTrigger
                className="w-fit items-center text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold text-base flex p-2 px-3 rounded-md gap-2"
                onClick={() => setIsAddMemberDialogOpen(true)}
            >
                <UserPlus />
                Adicionar
            </DialogTrigger>
            <DialogContent className="bg-brown-100 rounded-lg">
                <DialogHeader className="text-start">
                    <DialogTitle className="text-brown-700 text-2xl">
                        Novo Membro
                    </DialogTitle>
                    <DialogDescription className="text-brown-500">
                        Preencha os campos abaixo e adicione um novo membro!
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <Label>Email do membro</Label>
                    <Input
                        type="email"
                        value={newMemberEmail}
                        placeholder="Digite o email do novo membro"
                        className="bg-brown-300 border-brown-600"
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                </div>

                <Button
                    type="submit"
                    onClick={() => handleAddMemberSubmit(newMemberEmail)}
                    className="bg-brown-800 hover:bg-brown-500 mt-2"
                >
                    Adicionar
                </Button>
            </DialogContent>
        </Dialog>
    )
}