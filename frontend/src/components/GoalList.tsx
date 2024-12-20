import { useOutletContext } from "react-router-dom"
import { PartyContext } from "@/components/PartyDetails"
import { AddGoalForm } from "@/components/AddGoalForm"
import { BadgeCheck, Frown, Loader, SquareCheckBig } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { EditGoalForm } from "./EditGoalForm"
import { RemoveGoalButton } from "./RemoveGoalButton"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export function GoalList() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const { party, fetchParty } = useOutletContext<PartyContext>()

    if (!party) {
        return (
            <div className="w-full h-full flex mt-10 justify-center gap-2 bg-brown-300">
                <Loader className="animate-spin" />
                Carregando metas da party
            </div>
        )
    }

    const totalPartyShits = party.members.reduce((total, member) => total + member.individualShits, 0)

    const { toast } = useToast()

    async function handleCompleteGoal(goalId: string) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${party._id}/goal/edit`, {completed: true, goalId}, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                }
            })

            fetchParty()
            toast({
                variant: "default",
                title: "Sucesso",
                description: "A meta foi concluída com sucesso!",
            })
        } catch (error: any) {
            console.error(error.message)
        }
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
                                {goal.completed ? (
                                    <BadgeCheck className="text-green-600" fill="white" />
                                ) : totalPartyShits >= goal.targetShits ? (
                                    <SquareCheckBig 
                                        className="text-black animate-pulse" 
                                        fill="green"
                                        onClick={() => handleCompleteGoal(goal._id)}
                                    />
                                ) : (
                                    <EditGoalForm goal={goal} fetchParty={fetchParty} partyId={party._id} />
                                )}
                                
                                <RemoveGoalButton goal={goal} fetchParty={fetchParty} partyId={party._id} />
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