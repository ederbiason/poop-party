import { useOutletContext } from "react-router-dom"
import { PartyContext } from "@/components/PartyDetails"
import { AddGoalForm } from "@/components/AddGoalForm"
import { Frown, Loader, SquarePen, SquareX } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function GoalList() {
    const { party, fetchParty } = useOutletContext<PartyContext>()
    const [isRemoveGoalDialogOpen, setIsRemoveGoalDialogOpen] = useState(false)
    const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false)
    const [newShitTarget, setNewShitTarget] = useState<number>(1)

    if (!party) {
        return (
            <div className="w-full h-full flex mt-10 justify-center gap-2 bg-brown-300">
                <Loader className="animate-spin" />
                Carregando metas da party
            </div>
        )
    }

    const totalPartyShits = party.members.reduce((total, member) => total + member.individualShits, 0)

    async function handleRemoveGoal(goalId: string) {

    }

    async function handleEditGoal(goalId: string) {

    }

    return (
        <div className="w-full h-full p-6 bg-brown-300">
            <div className="w-full flex items-center justify-between">
                <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                    Metas
                </h1>

                <AddGoalForm partyId={party._id} fetchParty={fetchParty} />
            </div>
            {party.goals.length > 0 ? (
                <div className="pt-10 py-6 flex flex-col gap-6">
                    {party.goals.sort((a, b) => b.targetShits - a.targetShits).map((goal) => (
                        <div key={goal._id} className=" bg-brown-400 p-3 rounded-lg flex gap-5">
                            <div className="flex gap-3 items-center justify-between relative flex-1">
                                <Checkbox
                                    disabled
                                    className="w-5 h-5"
                                    checked={goal.targetShits <= totalPartyShits}
                                />

                                <Progress value={((totalPartyShits) / goal.targetShits) * 100} className="h-2" />
                                <span
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-zinc-800"
                                >
                                    {Math.min(Number(((totalPartyShits / goal.targetShits) * 100).toFixed()), 100)}%
                                </span>

                                <p className="font-bold">
                                    {goal.targetShits}
                                </p>
                            </div>

                            <div className="flex flex-col justify-end gap-3 items-center">
                                <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
                                    <DialogTrigger
                                        className="flex items-center gap-2"
                                        onClick={() => {setIsEditGoalDialogOpen(true) 
                                            console.log(goal)}}
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
                                                Você está editando a meta: <span className="capitalize font-semibold">{goal.targetShits}</span>
                                            </p>
                                            <Label>
                                                Num. alvo de cagadas
                                            </Label>
                                            <Input
                                                defaultValue={goal.targetShits}
                                                type="number"
                                                placeholder="Digite o número alvo de cagadas"
                                                className="bg-brown-300 border-brown-600"
                                                onChange={(e) => setNewShitTarget(Number(e.target.value))}
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
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full h-full flex mt-10 justify-center gap-2 bg-brown-300">
                    Essa party ainda não possui metas.
                    <Frown />
                </div>
            )}
        </div>
    )
}