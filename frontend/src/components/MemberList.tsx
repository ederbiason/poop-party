import { CircleUserRound, Crown, Loader, ShieldCheck } from "lucide-react"
import { useOutletContext } from "react-router-dom"
import { AddMemberForm } from "@/components/AddMemberForm"
import { PartyContext } from "@/components/PartyDetails"
import { RemoveMemberButton } from "./RemoveMemberButton"
import { EditMemberForm } from "./EditMemberForm"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export function MemberList() {
    const { party, fetchParty } = useOutletContext<PartyContext>()

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
            <div className="w-full flex items-center justify-between">
                <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                    Membros
                </h1>

                <AddMemberForm members={party.members} partyId={party._id} fetchParty={fetchParty} />
            </div>

            <div className="w-full h-full flex flex-col gap-3 my-6">
                {party.members.sort((a, b) => b.individualShits - a.individualShits).map((member, index) => {
                    const isMemberCreator = party.createdBy === member.userId._id

                    return (
                        <div key={member.userId._id} className="bg-brown-400 rounded-lg p-3 flex items-center gap-3 relative text-brown-300">
                            {
                                member.userId.profileImage !== "" ? (
                                    <Avatar className="h-14 w-14 border-2 border-brown-700">
                                        <AvatarImage src={member.userId.profileImage} alt="Imagem de perfil do membro" className="object-cover" />
                                    </Avatar>
                                ) : (
                                    <CircleUserRound size={60} />
                                )
                            }

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
                                <EditMemberForm member={member} partyId={party._id} fetchParty={fetchParty} />
                                {isMemberCreator ? (
                                    <ShieldCheck color="black" fill="yellow" />
                                ) : (
                                    <RemoveMemberButton memberId={member.userId._id} partyId={party._id} fetchParty={fetchParty} />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}