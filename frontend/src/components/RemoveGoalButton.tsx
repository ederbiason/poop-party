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

interface RemoveGoalButtonProps {
    goal: {
        _id: string;
        targetShits: number;
        completed: boolean;
    }
}

export function RemoveGoalButton({ goal }: RemoveGoalButtonProps) {
    const [isRemoveGoalDialogOpen, setIsRemoveGoalDialogOpen] = useState(false)

    async function handleRemoveGoal(goalId: string) {

    }

    return (
        <Dialog open={isRemoveGoalDialogOpen} onOpenChange={setIsRemoveGoalDialogOpen}>
            <DialogTrigger
                className="flex items-center gap-2"
                onClick={() => setIsRemoveGoalDialogOpen(true)}
            >
                <SquareX className="text-red-700" />
            </DialogTrigger>
            <DialogContent className="bg-brown-100 rounded-lg">
                <DialogHeader className="text-start">
                    <DialogTitle className="text-brown-700 text-2xl">Tem certeza que deseja remover essa meta?</DialogTitle>
                    <DialogDescription className="text-brown-500">
                        Essa ação vai remover completamente a meta do grupo.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-row items-center justify-end gap-5">
                    <Button
                        type="button"
                        className="text-brown-300 bg-red-800 hover:bg-red-500 font-semibold"
                        onClick={() => setIsRemoveGoalDialogOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold"
                        onClick={() => handleRemoveGoal(goal._id)}
                    >
                        Continuar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}