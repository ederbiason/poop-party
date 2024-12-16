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
import { SquareX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface RemoveMemberButtonProps {
    memberId: string
    partyId: string
    fetchParty: () => Promise<void>
}

export function RemoveMemberButton({ memberId, partyId, fetchParty }: RemoveMemberButtonProps) {
    const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false)

    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const { toast } = useToast()

    async function handleRemoveMember(memberId: string) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/members/${memberId}`, {}, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                }
            })

            setIsRemoveMemberDialogOpen(false)
            fetchParty()
            toast({
                variant: "default",
                title: "Sucesso",
                description: "Você removeu o membro do grupo!",
            })
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <Dialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
            <DialogTrigger
                className="flex items-center gap-2"
                onClick={() => setIsRemoveMemberDialogOpen(true)}
            >
                <SquareX className="text-red-700" />
            </DialogTrigger>
            <DialogContent className="bg-brown-100 rounded-lg">
                <DialogHeader className="text-start">
                    <DialogTitle className="text-brown-700 text-2xl">Tem certeza que deseja remover esse membro?</DialogTitle>
                    <DialogDescription className="text-brown-500">
                        Essa ação vai remover completamente o membro do grupo.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-row items-center justify-end gap-5">
                    <Button
                        type="button"
                        className="text-brown-300 bg-red-800 hover:bg-red-500 font-semibold"
                        onClick={() => setIsRemoveMemberDialogOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold"
                        onClick={() => handleRemoveMember(memberId)}
                    >
                        Continuar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}