import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SquarePen } from "lucide-react"
import axios from "axios"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface EditMemberFormProps {
    member: {
        userId: {
            _id: string
            name: string
            email: string
        }
        individualShits: number
    }
    partyId: string
    fetchParty: () => Promise<void>
}

export function EditMemberForm({ member, partyId, fetchParty }: EditMemberFormProps) {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false)
    const [newShitAmount, setNewShitAmount] = useState<number>(0)

    const { toast } = useToast()

    async function handleEditMember(memberId: string) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/member/edit`, {memberId, amount: newShitAmount}, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                }
            })

            fetchParty()
            setIsEditMemberDialogOpen(false)
            toast({
                variant: "default",
                title: "Sucesso",
                description: "O membro foi alterado com sucesso!",
            })
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
            <DialogTrigger
                className="flex items-center gap-2"
                onClick={() => setIsEditMemberDialogOpen(true)}
            >
                <SquarePen className="text-blue-700" />
            </DialogTrigger>
            <DialogContent className="bg-brown-100 rounded-lg">
                <DialogHeader className="text-start">
                    <DialogTitle className="text-brown-700 text-2xl">
                        Editar Membro
                    </DialogTitle>
                    <DialogDescription className="text-brown-500">
                        Preencha os campos abaixo e altere a quantidade de cagadas do membro!
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <p className="italic mb-1">
                        Você está editando o membro: <span className="capitalize font-semibold">{member.userId.name}</span>
                    </p>
                    <Label>
                        Qtd. de cagadas
                    </Label>
                    <Input
                        defaultValue={member.individualShits}
                        type="number"
                        placeholder="Digite a número de cagadas do membro"
                        className="bg-brown-300 border-brown-600"
                        onChange={(e) => setNewShitAmount(Number(e.target.value))}
                    />
                </div>

                <DialogFooter className="flex flex-row items-center justify-end gap-5">
                    <Button
                        type="button"
                        className="text-brown-300 bg-red-800 hover:bg-red-500 font-semibold"
                        onClick={() => setIsEditMemberDialogOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold"
                        onClick={() => handleEditMember(member.userId._id)}
                    >
                        Editar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}