import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { SquarePen } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface EditGoalFormProps {
    goal: {
        _id: string;
        targetShits: number;
        completed: boolean;
    }
    fetchParty: () => Promise<void>
    partyId: string
}

export function EditGoalForm({ goal, fetchParty, partyId }: EditGoalFormProps) {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false)
    const [newTargetShits, setNewTargetShits] = useState<number>(1)

    const { toast } = useToast()

    async function handleEditGoal(goalId: string) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${partyId}/goal/edit`, {newTargetShits, goalId}, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                }
            })

            setIsEditGoalDialogOpen(false)
            fetchParty()
            toast({
                variant: "default",
                title: "Sucesso",
                description: "A meta foi alterada com sucesso!",
            })
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
            <DialogTrigger
                className="flex items-center gap-2"
                onClick={() => setIsEditGoalDialogOpen(true)}
            >
                <SquarePen className="text-blue-700" />
            </DialogTrigger>
            <DialogContent className="bg-brown-100 rounded-lg">
                <DialogHeader className="text-start">
                    <DialogTitle className="text-brown-700 text-2xl">
                        Editar Meta
                    </DialogTitle>
                    <DialogDescription className="text-brown-500">
                        Preencha os campos abaixo e altere as informações da meta!
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <p className="italic mb-1">
                        Você está editando a meta: <span className="capitalize font-semibold">{goal.targetShits} 💩</span>
                    </p>
                    <Label>
                        Num. alvo de cagadas
                    </Label>
                    <Input
                        defaultValue={goal.targetShits}
                        type="number"
                        placeholder="Digite o número alvo de cagadas"
                        className="bg-brown-300 border-brown-600"
                        onChange={(e) => setNewTargetShits(Number(e.target.value))}
                    />
                </div>

                <DialogFooter className="flex flex-row items-center justify-end gap-5">
                    <Button
                        type="button"
                        className="text-brown-300 bg-red-800 hover:bg-red-500 font-semibold"
                        onClick={() => setIsEditGoalDialogOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold"
                        onClick={() => handleEditGoal(goal._id)}
                    >
                        Editar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}