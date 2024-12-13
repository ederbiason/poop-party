import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { CircleUserRound, Crown, Loader, ShieldCheck, SquarePen, SquareX } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { AddMemberForm } from "@/components/AddMemberForm";
import { PartyContext } from "@/components/PartyDetails";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export function MemberList() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN
    const TOKEN = localStorage.getItem('token')

    const { toast } = useToast()

    const { party, fetchParty } = useOutletContext<PartyContext>()
    const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false)

    async function handleRemoveMember(memberId: string) {
        try {
            await axios.patch(`${BACKEND_DOMAIN}/parties/${party._id}/members/${memberId}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                }
            })
            
            setIsRemoveMemberDialogOpen(false)
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

    if (!party) {
        return (
            <div className="w-full h-full flex mt-10 justify-center gap-2 bg-brown-300">
                <Loader className="animate-spin" /> 
                Carregando membros da party
            </div>
        )
    }

    return (
        <div className="w-full h-full p-6 bg-brown-300">
            <div className="flex items-center justify-between">
                <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                    Membros
                </h1>

                <AddMemberForm members={party.members} partyId={party._id} fetchParty={fetchParty} />
            </div>

            <div className="w-full h-full flex flex-col gap-3 my-6">
                {party.members.sort((a, b) => b.individualShits - a.individualShits).map((member, index) => {
                    const isMemberAdmin = party.createdBy === member.userId._id

                    return (
                        <div key={member.userId._id} className="bg-brown-400 rounded-lg p-3 flex items-center gap-3 relative text-brown-300">
                            <CircleUserRound size={60} />

                            <div className="">
                                <p className="capitalize font-semibold text-lg flex items-center gap-2">
                                    {index === 0 && member.individualShits > 0 && (
                                        <Crown className="" size={24} fill="yellow" stroke="black" />
                                    )}
                                    {member.userId.name}
                                </p>

                                <p className="font-semibold text-lg">
                                    {member.individualShits} 💩
                                </p>
                            </div>

                            <div className="absolute top-2 right-2 flex gap-3">
                                <SquarePen className="text-blue-700" />
                                {isMemberAdmin ? (
                                    <ShieldCheck color="black" fill="yellow" />
                                ) : (
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
                                                    onClick={() => handleRemoveMember(member.userId._id)}
                                                >
                                                    Continuar
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}