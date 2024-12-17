import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SquarePlus } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface AddGoalFormProps {
    partyId: string
    fetchParty: () => Promise<void>
}

export function AddGoalForm({ partyId, fetchParty }: AddGoalFormProps) {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const [targetGoalShit, setTargetGoalShit] = useState<number>(0)
    const [isCreateGoalDialogOpen, setIsCreateGoalDialogOpen] = useState(false)

    const { toast } = useToast()

    async function handleGoalSubmit(targetShits: number) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/goals`, { targetShits }, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            toast({
                variant: "default",
                title: "Meta criada! 🎯",
                description: "A meta foi registrada na party com sucesso",
            })

            fetchParty()
            setIsCreateGoalDialogOpen(false)
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
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